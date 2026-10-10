import ShoppingListService from "./ShoppingListService";
import LichenService from "./LichenService";
import { toNoteText } from "../utils/toNoteText";

let running: Promise<void> | null = null;
let runAgain = false;

/**
 * Rewrites the user's Lichen "Shopping List" note from their current Elysia list (grouped by
 * recipe, see toNoteText). Elysia is the source of truth, so this always sends the whole list — a
 * missed or failed sync heals on the next one.
 *
 * Calls that arrive while a sync is running are coalesced into one follow-up run, so a burst of
 * checks and removals writes the note once more with the latest list instead of racing (which could
 * also create two notes).
 */
export const syncShoppingListToLichen = (userId: string): Promise<void> => {
  if (running) {
    runAgain = true;
    return running;
  }

  running = (async () => {
    do {
      runAgain = false;
      const items = await ShoppingListService.getList(userId);
      // null means the read was aborted; writing an empty note from that would wipe the list.
      if (!items) continue;

      await LichenService.saveShoppingListNote(userId, toNoteText(items));
    } while (runAgain);
  })().finally(() => {
    running = null;
  });

  return running;
};
