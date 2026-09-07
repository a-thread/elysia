interface HasId {
  id?: string;
}

/**
 * Diffs two id-keyed lists (e.g. a recipe's original vs. edited tags) into
 * what needs to be added and removed to turn `original` into `updated`.
 */
export const diffByIds = <T extends HasId>(
  original: T[],
  updated: T[]
): { toAdd: T[]; toRemove: T[] } => {
  const toAdd = updated.filter(
    (item) => !original.some((orig) => orig.id === item.id)
  );
  const toRemove = original.filter(
    (orig) => !updated.some((item) => item.id === orig.id)
  );
  return { toAdd, toRemove };
};

/**
 * Diffs `original` vs `updated`, then calls `add`/`remove` with only the
 * items that changed. The recipe/collection ellipsis-menu equivalent of this
 * pattern (many-to-many relationship sync on save) was previously
 * hand-rolled per entity (tags, collections, recipes); this is the shared
 * version.
 */
export const syncRelationship = async <T extends HasId>(
  original: T[],
  updated: T[],
  add: (items: T[]) => Promise<unknown>,
  remove: (items: T[]) => Promise<unknown>
): Promise<void> => {
  const { toAdd, toRemove } = diffByIds(original, updated);
  if (toAdd.length > 0) await add(toAdd);
  if (toRemove.length > 0) await remove(toRemove);
};
