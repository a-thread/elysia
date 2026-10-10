import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";

/**
 * Lichen (the notes app) keeps its notes in the `note` table of the same Supabase project's
 * `public` schema, row-level-secured to the signed-in user, with the body stored as JSON
 * (`{ "type": "text", "text": "..." }`). Elysia's client is pinned to the `elysia` schema, so
 * every call here selects `public` explicitly.
 */
export const SHOPPING_LIST_NOTE_TITLE = "Shopping List";

const noteTable = (client: SupabaseClient) =>
  client.schema("public").from("note");

/**
 * Creates the user's "Shopping List" note, or replaces the text of the existing one. The note
 * is found by title, so renaming it in Lichen makes Elysia start a fresh one.
 */
const saveShoppingListNote = async (userId: string, text: string) => {
  return await supabaseWithAbort.request(
    "lichen-saveShoppingListNote",
    async (client) => {
      const { data: existing, error: findError } = await noteTable(client)
        .select("id")
        .eq("user_id", userId)
        .eq("title", SHOPPING_LIST_NOTE_TITLE)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (findError) throw new Error("Failed to look up the Shopping List note.");

      const now = new Date().toISOString();
      const body = JSON.stringify({ type: "text", text });

      if (existing) {
        const { error } = await noteTable(client)
          .update({ body, updated_at: now, updated_by: userId })
          .eq("id", existing.id);
        if (error) throw new Error("Failed to update the Shopping List note.");
        return existing.id as string;
      }

      const id = crypto.randomUUID();
      const { error } = await noteTable(client).insert({
        id,
        user_id: userId,
        title: SHOPPING_LIST_NOTE_TITLE,
        body,
        created_at: now,
        created_by: userId,
        updated_at: now,
        updated_by: userId,
        is_public: false,
      });
      if (error) throw new Error("Failed to create the Shopping List note.");
      return id;
    },
  );
};

const LichenService = { saveShoppingListNote };

export default LichenService;
