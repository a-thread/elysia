import axios from 'axios';
import { load } from 'cheerio';
const proxyUrl = 'https://proxy.corsfix.com/?';

export async function scrapeRecipeForDB(url) {
  const recipe = {};

  function parseIngredient(ingredientText) {
    const fractionMap = {
      '½': 0.5,
      '⅓': 1 / 3,
      '⅔': 2 / 3,
      '¼': 0.25,
      '¾': 0.75,
      '⅕': 0.2,
      '⅖': 0.4,
      '⅗': 0.6,
      '⅘': 0.8,
    };

    // Remove special characters like "▢" and normalize fractions
    const normalizedText = ingredientText
      .replace(/[^a-zA-Z0-9¼½¾⅓⅔⅕⅖⅗⅘.\s]/g, '') // Removes special characters
      .replace(/[¼½¾⅓⅔⅕⅖⅗⅘]/g, (match) => fractionMap[match] || match); // Convert fractions to decimals

    return normalizedText;
  }

  function parseTimeByClass(labelElement) {
    if (!labelElement.length) return 0;

    const timeText = labelElement.text().trim();
    const timeValue = parseInt(timeText.match(/\d+/));
    const isHour = /hour/i.test(timeText);

    return isHour ? (timeValue || 0) * 60 : (timeValue || 0); // Convert hours to minutes
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get(proxyUrl + encodedUrl); // Add proxy prefix
    const html = response.data;
    const $ = load(html);

    // Scraping logic remains the same
    recipe.image =
      $("meta[property='og:image']").attr('content') ||
      $("meta[name='og:image']").attr('content') ||
      $("meta[itemprop='image']").attr('content');

    const description =
      $("meta[name='description']").attr('content') ||
      $("meta[property='og:description']").attr('content') ||
      $("meta[name='twitter:description']").attr('content');

    recipe.description = description ? description.replace(/\n/g, ' ').trim() : '';

    recipe.title = $("h1.recipe-title").text().trim() || $('h1').first().text().trim() || 'Untitled Recipe';

    const ingredients = [];
    $('ul[class*="ingredients"] li').each((i, el) => {
      const rawIngredient = $(el).text().trim();
      ingredients.push(parseIngredient(rawIngredient));
    });

    const steps = [];
    $('ol[class*="instructions"] li').each((i, el) => {
      steps.push({ step_number: i + 1, instruction: $(el).text().trim() });
    });

    if (steps.length === 0) {
      $('ul[class*="instructions"] li').each((i, el) => {
        steps.push({ step_number: i + 1, instruction: $(el).text().trim() });
      });
    }

    // Find the label element containing the time value
    const prepTime = $(`*[class*="prep_time"]`).filter(function () {
      return /\d+/.test($(this).text()); // Ensure text contains a number
    });

    const cookTime = $(`*[class*="cook_time"]`).filter(function () {
      return /\d+/.test($(this).text()); // Ensure text contains a number
    });

    recipe.prep_time = parseTimeByClass(prepTime);
    recipe.cook_time = parseTimeByClass(cookTime);

    const recipeData = {
      title: recipe.title,
      description: recipe.description,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      ingredients,
      steps,
    };

    return recipeData;
  } catch (error) {
    return null;
  }
}
