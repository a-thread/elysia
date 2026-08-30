import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaTag, FaTimes } from "react-icons/fa";
import SortableItem from "./SortableItem";
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
  const ghostBtnClasses =
    "flex items-center justify-center gap-1.5 border border-dashed border-gray-300 dark:border-gray-600 hover:border-leaf-green-300 hover:bg-leaf-green-50/60 hover:text-leaf-green-700 dark:hover:border-leaf-green-600 dark:hover:bg-leaf-green-900/30 text-gray-500 dark:text-gray-400 text-sm font-semibold rounded-lg py-2 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-300";

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
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
            <div className="mb-2.5 flex flex-col gap-2.5">
              {chunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex}>
                  {!!chunk.group && (
                    <div className="flex items-center gap-2 bg-leaf-green-50 dark:bg-leaf-green-900/40 border border-leaf-green-100 dark:border-leaf-green-800 rounded-lg px-2.5 py-1.5 mb-2">
                      <FaTag className="w-3 h-3 text-leaf-green-700 dark:text-leaf-green-300 shrink-0" />
                      <input
                        type="text"
                        aria-label="Group name"
                        value={chunk.group}
                        onChange={(e) =>
                          onRenameGroup(
                            chunk.items.map((item) => item.id),
                            e.target.value
                          )
                        }
                        className="flex-1 min-w-0 text-xs font-bold uppercase tracking-wide text-leaf-green-800 dark:text-leaf-green-200 bg-transparent border-0 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        title={`Delete ${chunk.group} group`}
                        aria-label={`Delete ${chunk.group} group`}
                        onClick={() =>
                          onDeleteGroup(chunk.items.map((item) => item.id))
                        }
                        className="shrink-0 text-leaf-green-700/60 hover:text-red-500 dark:text-leaf-green-300/60 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-300 rounded-full"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div
                    className={
                      chunk.group
                        ? "border-l-2 border-leaf-green-100 dark:border-leaf-green-800 pl-3.5 ml-1"
                        : ""
                    }
                  >
                    <ol>
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
                    {!!chunk.group && (
                      <button
                        type="button"
                        onClick={() => onAddClick(chunk.group)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-leaf-green-700 dark:text-gray-400 dark:hover:text-leaf-green-300 py-1 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-300 rounded"
                      >
                        <FaPlus className="w-2.5 h-2.5" />
                        Add to {chunk.group}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {formState.length > 0 && !chunks && (
            <ol className="mb-2.5 text-gray-700 dark:text-gray-300">
              {formState.map((v, index) => (
                <SortableItem
                  key={v.id}
                  id={v.id}
                  formValue={v}
                  onEditFormValue={onEditFormValue}
                  onDeleteClick={onDeleteClick}
                  number={index + 1}
                />
              ))}
            </ol>
          )}
        </SortableContext>
      </DndContext>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => onAddClick()}
          className={`${ghostBtnClasses} flex-1`}
        >
          <FaPlus className="w-2.5 h-2.5" />
          Add {sectionName}
        </button>
        {enableGrouping && (
          <button
            type="button"
            onClick={onAddGroupClick}
            className={`${ghostBtnClasses} flex-1 border-leaf-green-200 text-leaf-green-700 dark:border-leaf-green-700 dark:text-leaf-green-300`}
          >
            <FaPlus className="w-2.5 h-2.5" />
            Add Group
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableSectionForm;
