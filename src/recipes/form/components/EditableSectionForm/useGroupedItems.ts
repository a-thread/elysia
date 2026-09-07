import { useEffect, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { StepIngredient } from "@shared/models/StepIngredient";

interface GroupChunk {
  group?: string;
  items: StepIngredient[];
}

const chunkByGroup = (items: StepIngredient[]): GroupChunk[] => {
  const chunks: GroupChunk[] = [];
  items.forEach((item) => {
    const last = chunks[chunks.length - 1];
    if (last && (last.group || "") === (item.group || "")) {
      last.items.push(item);
    } else {
      chunks.push({ group: item.group, items: [item] });
    }
  });
  return chunks;
};

/**
 * Owns EditableSectionForm's local state: the debounced sync back to the
 * parent form, item add/edit/delete, drag-reorder, and (when grouping is
 * enabled) the group chunking/rename/delete operations. Kept separate from
 * the component so the state machine and its ~150 lines of JSX don't have
 * to be read together.
 */
export const useGroupedItems = (
  originalFormState: StepIngredient[],
  setOriginalFormState: (formState: StepIngredient[]) => void,
  enableGrouping: boolean
) => {
  const [formState, setFormState] =
    useState<StepIngredient[]>(originalFormState);

  useEffect(() => {
    setFormState([...originalFormState]);
  }, [originalFormState]);

  // Debounce function to emit new values every 400ms
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setOriginalFormState(formState);
    }, 400);

    return () => clearTimeout(debounceTimer); // Cleanup timer on component unmount or formState change
  }, [formState, setOriginalFormState]);

  const onEditFormValue = (updatedValue: StepIngredient) => {
    const newFormState = formState.map((existingValue) => {
      if (existingValue.id === updatedValue.id) {
        return updatedValue;
      }
      return existingValue;
    });
    setFormState(newFormState);
  };

  const onAddClick = (group?: string) => {
    const newItem: StepIngredient = { id: uuidv4(), value: "", group };
    setFormState((prevState) => {
      if (!group) return [...prevState, newItem];
      // Insert right after the group's last item so the group stays contiguous.
      const lastIndexOfGroup = prevState.reduce(
        (acc, item, idx) => (item.group === group ? idx : acc),
        -1
      );
      if (lastIndexOfGroup === -1) return [...prevState, newItem];
      const newState = [...prevState];
      newState.splice(lastIndexOfGroup + 1, 0, newItem);
      return newState;
    });
  };

  const onAddGroupClick = () => {
    setFormState((prevState) => [
      ...prevState,
      {
        id: uuidv4(),
        value: "",
        group: "New Group",
      },
    ]);
  };

  const onRenameGroup = (itemIds: string[], newGroupName: string) => {
    setFormState((prevState) =>
      prevState.map((item) =>
        itemIds.includes(item.id) ? { ...item, group: newGroupName } : item
      )
    );
  };

  const onDeleteGroup = (itemIds: string[]) => {
    setFormState((prevState) =>
      prevState.filter((item) => !itemIds.includes(item.id))
    );
  };

  const onDeleteClick = (idToDelete: string) => {
    const updatedIngredients = formState.filter((item) => item.id !== idToDelete);
    setFormState(updatedIngredients);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formState.findIndex((v) => v.id === active.id);
    const newIndex = formState.findIndex((v) => v.id === over.id);

    let newFormState = arrayMove(formState, oldIndex, newIndex);

    if (enableGrouping) {
      // The moved item inherits the group of whichever item now sits directly
      // before it (i.e. the item it was dropped after); dropping at the very
      // top ungroups it.
      const movedIndex = newFormState.findIndex((v) => v.id === active.id);
      const precedingItem = newFormState[movedIndex - 1];
      newFormState = newFormState.map((item, idx) =>
        idx === movedIndex ? { ...item, group: precedingItem?.group } : item
      );
    }

    setFormState(newFormState);
  };

  const chunks = enableGrouping ? chunkByGroup(formState) : null;

  return {
    formState,
    chunks,
    onEditFormValue,
    onAddClick,
    onAddGroupClick,
    onRenameGroup,
    onDeleteGroup,
    onDeleteClick,
    handleDragEnd,
  };
};
