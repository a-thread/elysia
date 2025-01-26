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
}

const EditableSectionForm: React.FC<EditableSectionFormProps> = ({
  originalFormState,
  setOriginalFormState,
  sectionName,
}) => {
  const [formState, setFormState] =
    useState<StepIngredient[]>(originalFormState);

  // set values on first load
  useEffect(() => {
    const updatedValues = formState.map((i) => ({
      ...i,
      isActive: true,
    }))
    setFormState(updatedValues);
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
        isActive: true,
        sort_number: 0,
      },
    ]);
  };

  const onDeleteClick = (idToDelete: string) => {
    const updatedIngredients = formState.map((existingIngredient) => {
      if (existingIngredient.id === idToDelete) {
        return {
          ...existingIngredient,
          isActive: false,
        };
      }
      return existingIngredient;
    });
    setFormState(updatedIngredients);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formState.findIndex((v) => v.id === active.id);
    const newIndex = formState.findIndex((v) => v.id === over.id);

    setFormState(arrayMove(formState, oldIndex, newIndex));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {sectionName}s
      </h2>
      {!(formState?.length > 0) && (
                  <EmptyState message={`No ${sectionName}s added yet. Add some to get started!`} />
                )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={formState.filter((v) => v.isActive).map((v) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          {formState.length > 0 && (
            <ol className="list-decimal mb-6 text-gray-700 dark:text-gray-300">
              {formState
                .filter((v) => v.isActive)
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
      <Button type="button" onClick={onAddClick}>
        Add {sectionName}
      </Button>
    </div>
  );
};

export default EditableSectionForm;
