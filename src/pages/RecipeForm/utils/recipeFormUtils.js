const deepCompare = (original, updated) => {
  if (original === updated) return null; // No change for primitive values

  if (
    typeof original !== "object" ||
    typeof updated !== "object" ||
    original === null ||
    updated === null
  ) {
    return updated; // Return updated value for primitive changes
  }

  if (Array.isArray(original) && Array.isArray(updated)) {
    const changedArray = updated.reduce((acc, newItem, index) => {
      const oldItem = original[index];

      // If item is an object, check for changes in its properties
      if (typeof newItem === "object" && newItem !== null) {
        const itemChanges = deepCompare(oldItem || {}, newItem);
        if (itemChanges !== null) {
          acc.push(newItem); // Return the whole modified object if anything changed
        }
      }
      // If a primitive value changed, return it
      else if (newItem !== oldItem) {
        acc.push(newItem);
      }

      return acc;
    }, []);

    // Detect removed elements (if original array was longer)
    if (original.length > updated.length) {
      return updated; // Return entire updated array if elements were removed
    }

    return changedArray.length > 0 ? changedArray : null;
  }

  const changed = {};
  const allKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);

  allKeys.forEach((key) => {
    const diff = deepCompare(original[key], updated[key]);
    if (diff !== null) {
      changed[key] = diff;
    }
  });

  return Object.keys(changed).length > 0 ? changed : null;
};

const getChangedFields = (original, updated) =>
  deepCompare(original, updated) || {};

// Export recipe service
const recipeFormUtils = {
  getChangedFields,
};

export default recipeFormUtils;
