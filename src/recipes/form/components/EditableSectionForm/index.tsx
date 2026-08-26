import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import SortableItem from "./SortableItem";
import { Button } from "@shared/components/Buttons";
import { StepIngredient } from "@shared/models/StepIngredient";
import EmptyState from "@shared/components/EmptyState";

interface EditableSectionFormProps {
  originalFormState: StepIngredient[];
  setOriginalFormState: (formState: StepIngredient[]) => void;
  sectionName: string;
  enableGrouping?: boolean;
}

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

const EditableSectionForm: React.FC<EditableSectionFormProps> = ({
  originalFormState,
  setOriginalFormState,
  sectionName,
  enableGrouping = false,
}) => {
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

  const onAddClick = () => {
    setFormState((prevState) => [
      ...prevState,
      {
        id: uuidv4(),
        value: "",
      },
    ]);
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

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {sectionName}s
      </h2>
      {!(formState?.length > 0) && (
        <EmptyState
          message={`No ${sectionName}s added yet. Add some to get started!`}
        />
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={formState.map((v) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          {formState.length > 0 && chunks && (
            <div className="mb-6">
              {chunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className="mb-2">
                  {!!chunk.group && (
                    <input
                      type="text"
                      value={chunk.group}
                      onChange={(e) =>
                        onRenameGroup(
                          chunk.items.map((item) => item.id),
                          e.target.value
                        )
                      }
                      className="block text-xs font-bold uppercase tracking-wide text-leaf-green-700 dark:text-leaf-green-300 bg-transparent border-0 border-b border-leaf-green-300 dark:border-leaf-green-700 focus:outline-hidden focus:border-leaf-green-500 px-0.5 py-1 mb-1"
                    />
                  )}
                  <ol
                    className={
                      chunk.group
                        ? "border-l-2 border-leaf-green-100 dark:border-leaf-green-800 pl-3 ml-0.5"
                        : ""
                    }
                  >
                    {chunk.items.map((v) => (
                      <SortableItem
                        key={v.id}
                        id={v.id}
                        formValue={v}
                        onEditFormValue={onEditFormValue}
                        onDeleteClick={onDeleteClick}
                      />
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
          {formState.length > 0 && !chunks && (
            <ol className="list-decimal mb-6 text-gray-700 dark:text-gray-300">
              {formState
                .map((v) => (
                  <SortableItem
                    key={v.id}
                    id={v.id}
                    formValue={v}
                    onEditFormValue={onEditFormValue}
                    onDeleteClick={onDeleteClick}
                  />
                ))}
            </ol>
          )}
        </SortableContext>
      </DndContext>
      <div className="flex gap-2">
        <Button type="button" onClick={onAddClick}>
          Add {sectionName}
        </Button>
        {enableGrouping && (
          <Button type="button" btnType="secondary" onClick={onAddGroupClick}>
            Add Group
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableSectionForm;
