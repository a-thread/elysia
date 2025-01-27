import axios from "axios";
import { load } from "cheerio";
import { v4 as uuidv4 } from "uuid";

const proxyUrl = "https://proxy.corsfix.com/?";

export async function scrapeRecipeForDB(url: string) {
  function parseIngredient(ingredientText: string): string {
    const fractionMap: { [key: string]: number } = {
      "½": 0.5,
      "⅓": 1 / 3,
      "⅔": 2 / 3,
      "¼": 0.25,
      "¾": 0.75,
      "⅕": 0.2,
      "⅖": 0.4,
      "⅗": 0.6,
      "⅘": 0.8,
    };

    // Remove HTML tags, special characters, and normalize fractions
    const normalizedText = ingredientText
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[^a-zA-Z0-9¼½¾⅓⅔⅕⅖⅗⅘.\s]/g, "") // Remove special characters
      .replace(/[¼½¾⅓⅔⅕⅖⅗⅘]/g, (match: any) => fractionMap[match] || match) // Convert fractions to decimals
      .trim();

    return normalizedText;
  }

  function stripHtml(text: string) {
    return text.replace(/<[^>]*>/g, "").trim(); // Remove any HTML tags
  }

  function parseTimeByClass(labelElement: any): number {
    if (!labelElement.length) return 0;

    const timeText = labelElement.text().trim();
    const timeValue = parseInt(timeText.match(/\d+/)?.[0] || "0");
    const isHour = /hour/i.test(timeText);

    return isHour ? timeValue * 60 : timeValue; // Convert hours to minutes
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get(proxyUrl + encodedUrl);
    const html = response.data;
    const $ = load(html);

    const img_url =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='og:image']").attr("content") ||
      $("meta[itemprop='image']").attr("content") ||
      $('img[class*="recipe-image"]').first().attr("src") ||
      $('img[class*="main-image"]').first().attr("src") ||
      $("img").first().attr("src");

    const originalDescription =
      $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='twitter:description']").attr("content") ||
      $(`*[class*="recipe-summary"]`) || '';

    const description = originalDescription
      ? stripHtml((originalDescription as string).replace(/\n/g, " ").trim())
      : "";

    const title =
      $("h1.recipe-title").text().trim() ||
      $("h1").first().text().trim() ||
      $("h2").first().text().trim() ||
      "Untitled Recipe";

    const ingredients: string[] = [];
    $('ul[class*="ingredients"] li').each((_, el) => {
      const rawIngredient = $(el).html();
      if (rawIngredient) {
        ingredients.push(parseIngredient(rawIngredient));
      }
    });
    
    if (ingredients.length === 0) {
      $('ol[class*="ingredients"] li').each((_, el) => {
        const rawIngredient = $(el).html();
        if (rawIngredient) {
          ingredients.push(parseIngredient(rawIngredient));
        }
      });
    }

    if (ingredients.length === 0) {
      $('div[class*="ingredients"] li').each((_, el) => {
        const rawIngredient = $(el).html();
        if (rawIngredient) {
          ingredients.push(parseIngredient(rawIngredient));
        }
      });
    }

    const steps: string[] = [];
    $('ol[class*="instructions"] li, ul[class*="instructions"] li').each((_, el) => {
      const stepHtml = $(el).html()
      if (stepHtml) {
        steps.push(stripHtml(stepHtml));
      }
    });

    if (steps.length === 0) {
      $('div[class*="instructions"] li').each((_, el) => {
        const stepHtml = $(el).html();
        if (stepHtml) {
          steps.push(stripHtml(stepHtml));
        }
      });
    }

    if (steps.length === 0) {
      $('div[class*="instructions"] div[class*="step"]').each((_, el) => {
        const stepHtml = $(el).html();
        if (stepHtml) {
          steps.push(stripHtml(stepHtml));
        }
      });
    }
    

    if (steps.length === 0) {
      $('ol[class*="preparation"] li').each((_, el) => {
        const stepHtml = $(el).html();
        if (stepHtml) {
          steps.push(stripHtml(stepHtml));
        }
      });
    }

    // Find the label element containing the time value
    const prepTime = $(`*[class*="prep_time"], *[class*="prep-time"]`).filter(function () {
      return /\d+/.test($(this).text());
    });

    const cookTime = $(`*[class*="cook_time"], *[class*="cook-time"]`).filter(function () {
      return /\d+/.test($(this).text());
    });


    let servings = $(`*[class*="servings"]`).filter(function () {
      return /\d+/.test($(this).text());
    })?.text()?.trim();

    if (!servings) {
     servings = $(`*[class*="yield"]`).filter(function () {
      return /\d+/.test($(this).text());
    })?.text()?.trim();
    }


    const recipeData = {
      title,
      description,
      img_url,
      prep_time: parseTimeByClass(prepTime),
      cook_time: parseTimeByClass(cookTime),
      servings: parseInt(servings.match(/\d+/)?.[0] || "0"),
      ingredients: ingredients.map((ingredient, index) => ({
        id: uuidv4(),
        value: ingredient,
        isActive: true,
        sort_number: index + 1,
      })),
      steps: steps.map((step, index) => ({
        id: uuidv4(),
        value: step,
        isActive: true,
        sort_number: index + 1,
      })),
      original_recipe_url: url,
    };
    return recipeData;
  } catch (error: any) {
    console.error(`Failed to scrape recipe from ${url}:`, error.message);
    return null;
  }
}
