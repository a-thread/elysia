interface HasId {
  id?: string;
}

/**
 * Returns items added or removed from original.
 */
export const diffByIds = <T extends HasId>(
  original: T[],
  updated: T[],
): { toAdd: T[]; toRemove: T[] } => {
  const toAdd = updated.filter(
    (item) => !original.some((orig) => orig.id === item.id),
  );
  const toRemove = original.filter(
    (orig) => !updated.some((item) => item.id === orig.id),
  );
  return { toAdd, toRemove };
};

/**
 * Compares `original` and `updated` and then calls `add` or `remove`
 * for items that changed.
 */
export const syncRelationship = async <T extends HasId>(
  original: T[],
  updated: T[],
  add: (items: T[]) => Promise<unknown>,
  remove: (items: T[]) => Promise<unknown>,
): Promise<void> => {
  const { toAdd, toRemove } = diffByIds(original, updated);
  if (toAdd.length > 0) await add(toAdd);
  if (toRemove.length > 0) await remove(toRemove);
};
