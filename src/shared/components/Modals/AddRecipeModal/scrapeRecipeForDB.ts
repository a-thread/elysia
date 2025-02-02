import axios from "axios";
import { load } from "cheerio";
import { v4 as uuidv4 } from "uuid";

const proxyUrl = "https://proxy.corsfix.com/?";

export async function scrapeRecipeForDB(url) {
  try {
    const response = await axios.get(proxyUrl + encodeURIComponent(url), { validateStatus: false });
    return parseRecipeFromHtml(response.data, url);
  } catch (error) {
    console.error(`Failed to scrape recipe from ${url}:`, error.message);
    return error;
  }
}

export async function parseRecipeFromHtml(html, url) {
  const $ = load(html);

  const img_url = extractFirstMatch($, [
    "meta[property='og:image']",
    "meta[name='og:image']",
    "meta[itemprop='image']",
    "img[class*='recipe-image']:first",
    "img[class*='main-image']:first",
    "img:first"
  ], "content", "src");

  const description = extractFirstMatch($, [
    "meta[name='description']",
    "meta[property='og:description']",
    "meta[name='twitter:description']",
    "*[class*='recipe-summary']"
  ], "content") || "";

  const title = extractFirstText($, [
    "h1.recipe-title",
    "h1:first",
    "h2:first"
  ]) || "Untitled Recipe";

  const prepTime = extractTime($, ["*[class*='prep_time'], *[class*='prep-time']"]);
  const cookTime = extractTime($, ["*[class*='cook_time'], *[class*='cook-time']"]);
  const servings = extractServings($, ["*[class*='servings']", "*[class*='yield']"]);

  return {
    title,
    description: stripHtml(description.replace(/\n/g, " ").trim()),
    img_url,
    prep_time: prepTime,
    cook_time: cookTime,
    servings,
    ingredients: getIngredients($),
    steps: getItems($, [
      "ol[class*='instructions'] li, ul[class*='instructions'] li",
      "div[class*='instructions'] li",
      "div[class*='instructions'] div[class*='step']",
      "ol[class*='preparation'] li"
    ], stripHtml),
    original_recipe_url: url,
  };
}

function extractFirstMatch($, selectors, attr1, attr2) {
  for (const selector of selectors) {
    const element = $(selector);
    if (element.length) return element.attr(attr1) || element.attr(attr2);
  }
  return "";
}

function extractFirstText($, selectors) {
  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text) return text;
  }
  return "";
}

function extractTime($, selectors) {
  const labelElement = $(selectors.join(", ")).filter(function () {
    return /\d+/.test($(this).text());
  });
  return parseTimeByClass(labelElement);
}

function extractServings($, selectors) {
  for (const selector of selectors) {
    const text = $(selector).filter(function () {
      return /\d+/.test($(this).text());
    }).text().trim();
    if (text) return parseInt(text.match(/\d+/)?.[0] || "0");
  }
  return 0;
}

function getIngredients($) {
  const ingredients = [];
  const selectors = ["ul[class*='ingredients'] li", "ol[class*='ingredients'] li", "div[class*='ingredients'] li"];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const content = $(el).text().trim();
      if (content) ingredients.push(parseIngredient(content));
    });
    if (ingredients.length) break;
  }
  
  return ingredients.map((value, index) => ({ id: uuidv4(), value, isActive: true, sort_number: index + 1 }));
}

function getItems($, selectors, parser) {
  const items = [];
  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const content = $(el).html();
      if (content) items.push(parser(content));
    });
    if (items.length) break;
  }
  return items.map((value, index) => ({ id: uuidv4(), value, isActive: true, sort_number: index + 1 }));
}
function parseIngredient(ingredientText) {
  const fractionMap = { "½": "1/2", "⅓": "1/3", "⅔": "2/3", "¼": "1/4", "¾": "3/4", "⅕": "1/5", "⅖": "2/5", "⅗": "3/5", "⅘": "4/5" };
  return ingredientText
    .replace(/(\d+)([¼½¾⅓⅔⅕⅖⅗⅘])/g, "$1 $2") // add space between whole numbers and fractions
    .replace(/[¼½¾⅓⅔⅕⅖⅗⅘]/g, match => fractionMap[match] || match) //convert fraction special characters to normalized ones
    .replace(/([0-9\/]+)([a-zA-Z])/g, "$1 $2") // add space between numbers and alpha characters 
    .trim();
}

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, "").trim();
}

function parseTimeByClass(labelElement) {
  if (!labelElement.length) return 0;
  const timeText = labelElement.text().trim();
  const timeValue = parseInt(timeText.match(/\d+/)?.[0] || "0");
  return /hour/i.test(timeText) ? timeValue * 60 : timeValue;
}
