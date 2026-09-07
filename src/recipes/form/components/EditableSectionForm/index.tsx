import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FaPlus, FaTag, FaTimes } from "react-icons/fa";
import SortableItem from "./SortableItem";
import { useGroupedItems } from "./useGroupedItems";
import { StepIngredient } from "@recipes/models/StepIngredient";
import EmptyState from "@shared/components/EmptyState";

interface EditableSectionFormProps {
  originalFormState: StepIngredient[];
  setOriginalFormState: (formState: StepIngredient[]) => void;
  sectionName: string;
  enableGrouping?: boolean;
}

const EditableSectionForm: React.FC<EditableSectionFormProps> = ({
  originalFormState,
  setOriginalFormState,
  sectionName,
  enableGrouping = false,
}) => {
  const {
    formState,
    chunks,
    onEditFormValue,
    onAddClick,
    onAddGroupClick,
    onRenameGroup,
    onDeleteGroup,
    onDeleteClick,
    handleDragEnd,
  } = useGroupedItems(originalFormState, setOriginalFormState, enableGrouping);

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
