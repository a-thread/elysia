import { RecipeNutrition } from "@recipes/models/Recipe";
import { normalizeNutrition } from "@recipes/utils/normalizeNutrition";
import { CheerioAPI } from "cheerio";

/**
 * Per-serving nutrition from a page's schema.org Recipe structured data
 * (`<script type="application/ld+json">`) — the same reading the recipe-scraper service does for
 * URL imports. Values are free text ("250 calories", "12 g"), so the first number in each is used.
 * Null unless calories, protein, carbohydrates and fat are all present.
 */
export function parseJsonLdNutrition($: CheerioAPI): RecipeNutrition | null {
    for (const script of $("script[type='application/ld+json']").toArray()) {
        let json: unknown;
        try {
            // .html() returns a script's raw text; malformed JSON in one script must not hide the others.
            json = JSON.parse($(script).html() ?? "");
        } catch {
            continue;
        }

        for (const recipe of findRecipes(json)) {
            const nutrition = fromNutrition(recipe.nutrition);
            if (nutrition) return nutrition;
        }
    }
    return null;
}

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

// Recipes appear as the root object, as items of a root array, or inside an "@graph" array.
function findRecipes(node: unknown): JsonObject[] {
    if (Array.isArray(node)) return node.flatMap(findRecipes);
    if (!isObject(node)) return [];
    return [...(isRecipe(node) ? [node] : []), ...findRecipes(node["@graph"])];
}

function isRecipe(node: JsonObject): boolean {
    const type = node["@type"];
    const types = Array.isArray(type) ? type : [type];
    return types.some((t) => typeof t === "string" && /recipe$/i.test(t));
}

function fromNutrition(nutrition: unknown): RecipeNutrition | null {
    if (!isObject(nutrition)) return null;

    const calories = readNumber(nutrition.calories, true);
    const protein = readNumber(nutrition.proteinContent);
    const carbs = readNumber(nutrition.carbohydrateContent);
    const fat = readNumber(nutrition.fatContent);
    if (calories === null || protein === null || carbs === null || fat === null) return null;

    return normalizeNutrition({
        calories: Math.round(calories),
        protein: round1(protein),
        carbs: round1(carbs),
        fat: round1(fat),
    });
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function readNumber(value: unknown, isEnergy = false): number | null {
    const text = typeof value === "number" ? String(value) : typeof value === "string" ? value : "";
    const match = text.match(/\d+(?:[.,]\d+)?/);
    if (!match) return null;

    let number = parseFloat(match[0].replace(",", "."));
    if (!Number.isFinite(number) || number < 0) return null;

    // Some sites publish energy in kilojoules only.
    if (isEnergy && /\bkj\b|kilojoule/i.test(text) && !/cal/i.test(text)) number /= 4.184;
    // A milligram value is not grams (rare, but would be off by 1000x).
    if (!isEnergy && /\d\s*mg\b|milligram/i.test(text)) number /= 1000;

    return number;
}
