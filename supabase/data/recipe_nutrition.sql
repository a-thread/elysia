-- Per-serving nutrition estimates for existing recipes, estimated by Claude from the ingredient
-- lists in the recipe export. Run after migration 20261005000011_recipe_nutrition.sql.
--
-- These are ESTIMATES (roughly +/-15%): quantities were converted to weights and summed, then divided
-- by the recipe's `servings`. Rows with a note below used an assumption you may want to correct; if
-- you change a recipe's servings in Elysia, adjust its row here (or edit nutrition directly).
--
-- Not estimated (no usable quantities): all purpose salad dressing, fresh spring rolls,
-- philly cheesesteak, smash bowl. Add amounts to those recipes and re-export to include them.
--
-- Only rows that still have no nutrition are touched, so re-running is harmless, and manual
-- edits are never overwritten. (Migration 11 keeps last_updated unchanged for this update.)
--
-- columns: id, calories (kcal), protein g, carbs g, fat g, tier (NOVA 1-4)

update elysia.recipes r
set nutrition = jsonb_build_object(
  'calories', v.calories,
  'protein', v.protein,
  'carbs', v.carbs,
  'fat', v.fat,
  'tier', v.tier,
  'source', 'llm',
  'estimated_at', now()
)
from (values
  -- Adas Polo ba Khorma: 24 servings as listed (small portions)
  ('e77eac9f-af9a-4580-97e2-54e575c86f58', 171, 4.2, 30, 4, 1),
  -- Apple Crisp
  ('f6e7c00a-a086-437d-a14c-a23ff81dbec1', 247, 2.3, 38, 10, 3),
  -- bbq seitan + slaw sammy: servings was 1; assumed 4 sandwiches (4 buns, 1 seitan recipe)
  ('40190209-9441-4da4-a353-1a5200d8ade3', 690, 36, 95, 20, 3),
  -- Best Pizza Dough: per 1/6 of the dough, dough only
  ('8cc4f16f-aadb-43b3-a1b9-9082fc9a26fe', 400, 11, 80, 3.5, 3),
  -- blueberry muffins: the "? cup" flour in the topping was assumed to be 1/3 cup
  ('cd15076a-95ab-4c8b-b829-900f0593e369', 256, 2.7, 37, 10.5, 3),
  -- buffalo cauliflower: assumed 2 tbsp olive oil and 2 tbsp ranch per serving
  ('972121b3-d556-4624-809c-349bef1d0361', 242, 3.5, 12, 20, 3),
  -- Butter Chicken: servings was 1 for the whole pot; assumed 4 servings
  ('a3ff7d3b-0d71-45c1-acb9-587a5ed57d0d', 480, 34, 18, 30, 3),
  -- Caramelized Onion Chickpea Salad Sandwich: filling only, no bread listed
  ('18141505-b1a1-4303-bed3-0f8af92fa6f6', 310, 12.6, 37, 14, 3),
  -- Channa Masala (no rice)
  ('10386e88-52e2-4f7d-9bc9-36502efd528b', 343, 13, 50, 11, 3),
  -- cheesy chickpea quesadillas: high because 2 servings share 4 tortillas, a can of chickpeas,
  -- 120 g cashews and the oils; if it really makes 4 servings, halve these numbers
  ('8cc0c81c-7b8b-4bf1-bd2d-22d541a94264', 1220, 41, 130, 62, 3),
  -- chocolate sweet potato torte
  ('53f170e8-e050-4847-8d54-d1dbf41dfc4b', 230, 5, 36, 8, 3),
  -- Cranberry Thanksgiving Bread (no raisins)
  ('34654356-62a0-4138-b470-2274cec6d261', 293, 4.3, 54.5, 6.6, 3),
  -- Crispy Honey-Soy Brussel Sprouts
  ('137667b3-6e7f-4058-9152-0b4d6ab6c70c', 178, 5.3, 21, 8.7, 1),
  -- depression mac n cheese: the whole box with 4 tbsp butter (servings 1)
  ('11db12b5-9b57-4a6c-8334-53c76cb15c84', 1150, 28, 140, 50, 4),
  -- Easy Chicken and Vegetable Meal Prep
  ('f5fce097-a533-4ad9-b043-013ac45fb30c', 465, 40, 39.5, 16, 1),
  -- Easy Homemade Meatball Recipe: 55 "servings" treated as 55 meatballs, so this is ONE meatball
  ('423eb7e2-a238-4f79-92aa-349e654119c0', 25, 1.9, 0.5, 1.8, 3),
  -- Easy Lemon Poppy Seed Muffins
  ('e2408314-d184-4662-a12d-6e63263ce4f9', 227, 4.4, 36.6, 6.8, 3),
  -- Easy Roast Chicken (chicken, butter and vegetables; no gravy)
  ('f8ce2ff9-a14d-43af-ae64-ce95fb7775c6', 445, 27, 26, 25, 1),
  -- fancy homemade pasta sauce: sauce only; servings was 1, assumed 4 servings; oil amount assumed 3 tbsp
  ('1a9a3a6d-514e-4c9f-bc88-f0fb80ee099c', 168, 4.8, 15, 11, 1),
  -- Fluffy Pancakes: 8 servings treated as 8 pancakes; no toppings
  ('8f02121f-2311-4722-afa9-bb3db2084f18', 116, 3.1, 14.5, 4.9, 3),
  -- Green Beans Almondine
  ('763d209d-c4c1-4ac3-826b-d30e8823fdb8', 145, 4, 13, 9.5, 1),
  -- Grilled Chicken Satay (with Peanut Sauce): 44 "servings" treated as 44 skewers
  ('5962410b-e068-4af6-aaa1-298184105c0d', 56, 3.7, 2.8, 3.4, 3),
  -- hamburger helper - but make it fancy: servings was 1; assumed 4 servings; box size guessed
  ('fa6d9e52-0f98-42cf-9a3c-1abfcca4bab8', 465, 22, 52, 19, 4),
  -- healthier rice crispy treats
  ('e5020cde-31d1-4410-a1a1-bce93280ab2b', 350, 12.5, 42, 15.5, 4),
  -- homemade pasta sauce: sauce only; servings was 1, assumed 4
  ('e798d996-a952-4ba6-8ff9-18ce7863de89', 65, 3.3, 11.5, 0.7, 3),
  -- Hotteok Cookies: 8 servings treated as 8 cookies
  ('5fe0c5c6-cc4a-4816-954f-cebdd2049622', 317, 2.9, 45, 14, 3),
  -- instant pot vegan curried butternut squash
  ('0eaf3f37-3c5b-46a0-80ce-8a35e30f35d9', 270, 5, 39.5, 12, 1),
  -- instapot cheesy lentils + rice: dairy cheese assumed; no rice is listed in the ingredients
  ('9cd71854-a2cd-4721-a18f-9ed033cbc77c', 550, 33, 61, 19.5, 3),
  -- Maple Balsamic Tofu Acorn Squash Sandwich: no bread listed
  ('d31055dc-fc6c-4f1a-a172-a03220f670c7', 700, 45, 55, 33, 3),
  -- miso squash baos: 6 servings treated as 6 large baos; oil assumed 2 tbsp
  ('8be89b64-ecc1-4fcf-b513-0efd78713c8b', 465, 18, 74, 10, 3),
  -- No-Bake Chocolate Oatmeal Cookies: 24 servings treated as 24 cookies
  ('36742918-7264-405d-8835-6916bab769a8', 174, 3, 25, 7.4, 3),
  -- oddly specific green smoothie
  ('d0cc4613-53e6-4b4e-9893-8c366d8e5106', 285, 5, 68, 1.5, 1),
  -- Pasta alla Genovese: wine counted at roughly 60% of its calories
  ('b1d2caaa-bb95-46de-80d0-68f751629b60', 600, 27.5, 66, 24, 3),
  -- pastel des tres leches (no fruit)
  ('115aae7c-184f-4f5b-80ba-fa8f523cfe81', 540, 9, 54, 32.6, 3),
  -- Pina Colada Smoothie: canned coconut milk assumed
  ('4873b584-3fcf-49e8-8f10-6dd0e5defc5c', 255, 2.5, 38, 11.5, 1),
  -- Pozole Verde: without the optional crema, flaky salt, avocado
  ('0e5e4b8e-2d89-4a55-9835-e588c6c80aaf', 365, 12, 34, 21, 1),
  -- pumpkin spice smoothie: unsweetened almond-style milk and 30 g unflavored protein powder assumed
  ('866babd6-355e-4ad3-a6f9-8f5894f1b792', 420, 32, 60, 6, 3),
  -- Sick Day Soup
  ('6e9be0b7-8723-431b-b6e6-06cca8193f17', 72, 8, 5.5, 1.8, 1),
  -- simple seitan: only what is eaten, not the simmering liquid
  ('49724140-a806-4d62-8ed5-18a8becc9cff', 172, 25.5, 6, 4.8, 3),
  -- Snickerdoodle Protein Cookies: 9 servings treated as 9 cookies
  ('d65828b2-e0ee-49bb-9e05-1447c5a014aa', 225, 9, 22, 11.5, 4),
  -- spinach + walnut crumble gnocchi: package sizes assumed (500 g gnocchi, 250 g mushrooms each)
  ('dbedba66-3a4c-41f4-b2ca-1061c7dc543a', 420, 16, 62, 13.5, 3),
  -- Strawberry Rhubarb Crisp
  ('0e4fd6e3-fe79-415f-a4c7-075bcbb6bafc', 190, 2.6, 34, 5, 3),
  -- Sweet and Spicy Tofu With Soba Noodles: "18 ounce" read as 8 oz of soba; all oil counted
  ('918513c8-8c57-495f-bd34-b680d2350475', 1210, 70, 116, 53, 3),
  -- sweet potato praline casserole
  ('7acf47ea-6b5c-4fab-902f-bd37f40bc8ee', 635, 6.5, 74, 36, 3),
  -- thai peanut sauce: servings was 1; assumed 8 servings (about 2 tbsp each)
  ('5e336ac4-f26f-45c6-be13-4b9fc7361ac6', 230, 5, 12, 19, 3),
  -- The Best Apple Crisp Recipe
  ('453a64e8-d4a1-44f4-bccc-6a3b6b8d5997', 250, 1.5, 48, 6.2, 3),
  -- The Best Healthy Turkey Lasagna You'll Ever Eat
  ('2933e70d-3895-46d3-adc8-3876a73bec83', 385, 25.5, 27.5, 19.6, 3),
  -- The Best Turkey Meatloaf
  ('dd055218-35bb-4960-9aec-620ea1ddfe01', 325, 30.5, 17, 14, 3),
  -- The Best Vegan Lasagna: "12 cup" nutritional yeast read as 1/2 cup; vegan mozzarella roughly 800 kcal total
  ('5c2f7988-598c-4bdf-baef-3bf57445f185', 600, 28.5, 70, 23, 3),
  -- the famous sausage pasta: pappardelle assumed 12 oz dry; Beyond sausage
  ('59df1a03-d6c5-4c0a-875d-94371ce36c63', 690, 33.5, 77, 27, 4),
  -- Tofu Satay Salad: high because 4 blocks of tofu (assumed 14 oz each) + 1 cup peanut butter + 2 avocados over 6 servings
  ('17616588-685d-483d-bc9b-1a60f758d2b1', 990, 66, 46, 62, 3),
  -- vegan earl grey tiramisu
  ('95bcab98-af8f-4de8-8a5c-fc50d20d1d9e', 400, 8, 25, 30, 3),
  -- vegan kale caesar with crispy chickpeas: whole salad per serving (2 servings)
  ('ba678745-e852-4a1e-b348-92b822050996', 1000, 36, 80, 62, 3),
  -- vegan queso: servings was 1; assumed 8 servings (about 1/3 cup)
  ('d2641d1b-a84e-4487-bae4-b6f7954d26a9', 160, 5, 11, 11.5, 3),
  -- warm mushroom salad with pine nut parm
  ('0194a04b-ea91-4041-b4c9-ba370d85774b', 570, 16, 36.5, 41, 1)
) as v(id, calories, protein, carbs, fat, tier)
where r.id = v.id::uuid
  and r.nutrition is null;
