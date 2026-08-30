import { Recipe } from "@shared/models/Recipe";
import { StepIngredient } from "@shared/models/StepIngredient";
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { v4 as uuidv4 } from "uuid";

const API = import.meta.env.VITE_RECIPE_SCRAPER_API || "";

export async function getRecipeFromScraper(url: string): Promise<Recipe> {
  const res = await axios.get(`${API}?url=${encodeURIComponent(url)}`);
  return res.data;
}

export async function parseRecipeFromHtml(html: string, url: string): Promise<Recipe> {
    const $ = load(html);

    const img_url = resolveUrl(extractFirstMatch($, [
        "meta[property='og:image']",
        "meta[name='og:image']",
        "meta[itemprop='image']",
        "img[class*='recipe-image']:first",
        "img[class*='main-image']:first",
        "img:first"
    ], "content", "src"), url);

    const description = extractFirstText($, [
        "meta[name='description']",
        "meta[property='og:description']",
        "meta[name='twitter:description']",
        "*[class*='recipe-summary']"
    ]) || "";

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
            "ol[class*='preparation'] li",
            "div[class*='steps'] ol li",
        ], stripHtml),
        original_recipe_url: url,
    };
}

function resolveUrl(possibleUrl: string, baseUrl: string): string {
    if (!possibleUrl) return "";
    try {
        return new URL(possibleUrl, baseUrl).href;
    } catch {
        return possibleUrl;
    }
}

function extractFirstMatch($: CheerioAPI, selectors: string[], attr1: string, attr2: string): string {
    for (const selector of selectors) {
        const element = $(selector);
        if (element.length) return element.attr(attr1) || element.attr(attr2) || "";
    }
    return "";
}

function extractFirstText($: CheerioAPI, selectors: string[]): string {
    for (const selector of selectors) {
        const text = $(selector).text().trim();
        if (text) return text;
    }
    return "";
}

function extractTime($: CheerioAPI, selectors: string[]): number {
    const labelElement = $(selectors.join(", ")).filter(function (this: any) {
        return /\d+/.test($(this).text());
    }).first();
    return parseTimeByClass(labelElement);
}

function extractServings($: CheerioAPI, selectors: string[]): number {
    for (const selector of selectors) {
        const text = $(selector).filter(function (this: any) {
            return /\d+/.test($(this).text());
        }).first().text().trim();
        if (text) return parseInt(text.match(/\d+/)?.[0] || "0");
    }
    return 0;
}

function getIngredients($: CheerioAPI): StepIngredient[] {
    const structural = getStructuralIngredientGroups($);
    if (structural.length) return structural.map(({ value, group }) => ({ id: uuidv4(), value, group }));

    const ingredients: { value: string; group?: string }[] = [];
    const selectors = ["ul[class*='ingredients'] li", "ol[class*='ingredients'] li", "div[class*='ingredients'] li"];

    for (const selector of selectors) {
        let currentGroup: string | undefined;
        $(selector).each((_, el) => {
            const $el = $(el);
            const groupHeading = extractInlineGroupHeading($el);
            if (groupHeading) {
                // The <li> is a sub-heading (e.g. "For the topping"), not an ingredient itself.
                currentGroup = groupHeading;
                return;
            }
            const content = $el.text().trim();
            if (content) ingredients.push({ value: parseIngredient(content), group: currentGroup });
        });
        if (ingredients.length) break;
    }

    return ingredients.map(({ value, group }) => ({ id: uuidv4(), value, group }));
}

// WP Recipe Maker and similar plugins split ingredients into named sub-groups (e.g.
// "For the topping") using a wrapping container per group — a sibling "group-name"
// label next to that group's own <ul>/<ol> — rather than a marker inside a shared
// list. Matches a container class like "wprm-recipe-ingredient-group" while excluding
// the label itself, whose class ends in "-group-name"/"-group-heading".
function isIngredientGroupContainer(className: string): boolean {
    return /(^|\s)[\w-]*ingredient-group(\s|$)/i.test(className);
}

function getStructuralIngredientGroups($: CheerioAPI): { value: string; group?: string }[] {
    const groupContainers = $("[class*='ingredient-group']").filter(
        (_, el) => isIngredientGroupContainer($(el).attr("class") || "")
    );
    if (!groupContainers.length) return [];

    const ingredients: { value: string; group?: string }[] = [];
    groupContainers.each((_, container) => {
        const $container = $(container);
        const groupName = $container
            .find("[class*='group-name'], [class*='group-heading']")
            .first()
            .text()
            .trim();
        const $namedItems = $container.find("li[class*='ingredient']");
        const $items = $namedItems.length ? $namedItems : $container.find("li");
        $items.each((_, li) => {
            const content = $(li).text().trim();
            if (content) ingredients.push({ value: parseIngredient(content), group: groupName || undefined });
        });
    });
    return ingredients;
}

// Sites without a structural group container (e.g. Tasty Recipes) instead render the
// group name as its own <li> within the same list, either bare or wrapped only in
// <strong>/<b>, ending in a colon and with no digits — real ingredient lines virtually
// always carry a quantity.
function extractInlineGroupHeading($el: ReturnType<CheerioAPI>): string | undefined {
    const text = $el.text().trim();
    const children = $el.children();
    const onlyStrongChild = children.length === 1 && children.first().is("strong, b");
    if ((onlyStrongChild || children.length === 0) && /:$/.test(text) && !/\d/.test(text) && text.length < 40) {
        return text.replace(/:$/, "");
    }
    return undefined;
}

function getItems($: CheerioAPI, selectors: string[], parser: (content: string) => string): StepIngredient[] {
    const items: string[] = [];
    for (const selector of selectors) {
        $(selector).each((_: any, el: any) => {
            const $el = $(el).clone();
            removeStepNumberBadges($, $el);
            const content = $el.html();
            if (content) items.push(parser(content));
        });
        if (items.length) break;
    }
    return items.map((value) => ({ id: uuidv4(), value }));
}

// Some sites (e.g. NYT Cooking) render the step number as its own badge element
// alongside the step text within the same list item, rather than via a CSS counter
// — e.g. <div class="...stepNumber...">Step 1</div><div class="...stepContent...">...
// Left in place, that badge's text ("Step 1") gets prepended to every step.
function removeStepNumberBadges($: CheerioAPI, $el: ReturnType<CheerioAPI>): void {
    $el.find("[class]").each((_: any, child: any) => {
        const className = $(child).attr("class") || "";
        if (/(step|instruction)[-_]?number/i.test(className)) {
            $(child).remove();
        }
    });
}

function parseIngredient(ingredientText: string): string {
    const fractionMap: { [key: string]: string } = { "½": "1/2", "⅓": "1/3", "⅔": "2/3", "¼": "1/4", "¾": "3/4", "⅕": "1/5", "⅖": "2/5", "⅗": "3/5", "⅘": "4/5" };
    return ingredientText
        .replace(/[▢☐□]/g, "") // strip WPRM's decorative checkbox glyph
        .replace(/\s+/g, " ") // collapse newlines/runs of whitespace left over from nested quantity/unit/name/notes spans
        .replace(/(\d+)([¼½¾⅓⅔⅕⅖⅗⅘])/g, "$1 $2") // add space between whole numbers and fractions
        .replace(/[¼½¾⅓⅔⅕⅖⅗⅘]/g, match => fractionMap[match] || match) //convert fraction special characters to normalized ones
        .replace(/([0-9\/]+)([a-zA-Z])/g, "$1 $2") // add space between numbers and alpha characters
        .trim();
}

function stripHtml(html: string): string {
    // Replace (rather than delete) tags first so adjacent elements/line breaks (e.g. <br>,
    // </p><p>) don't glue their text together, then let cheerio decode entities like
    // &amp;/&nbsp; that a plain tag-strip would otherwise leave in the output verbatim.
    const withBreaks = html.replace(/<[^>]*>/g, " ");
    const decoded = load(`<div>${withBreaks}</div>`).text();
    return decoded.replace(/\s+/g, " ").trim();
}

function parseTimeByClass(labelElement: any): number {
    if (!labelElement.length) return 0;
    const timeText = labelElement.text().trim();
    const timeValue = parseInt(timeText.match(/\d+/)?.[0] || "0");
    return /hour/i.test(timeText) ? timeValue * 60 : timeValue;
}
