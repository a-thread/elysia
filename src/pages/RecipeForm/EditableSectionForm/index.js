import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from "uuid";
import SortableItem from './SortableItem';
import { Button } from '../../../shared/components/Buttons';

function EditableSectionForm({ originalFormState, setOriginalFormState, sectionName }) {
  const [formState, setFormState] = useState(originalFormState);

  // set values on first load
  useEffect(() => {
    setFormState(originalFormState);
  }, [originalFormState]);

  // Debounce function to emit new values every 400ms
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setOriginalFormState(formState);
    }, 400);

    return () => clearTimeout(debounceTimer); // Cleanup timer on component unmount or formState change
  }, [formState, setOriginalFormState]);

  const onEditFormValue = (updatedValue) => {
    const newFormState = formState.map((existingValue) => {
      if (existingValue.id === updatedValue.id) {
        return updatedValue;
      }
      return existingValue;
    });
    setFormState(newFormState);
  }

  const onAddClick = () => {
    setFormState((prevState) => [
      ...prevState,
      {
        id: uuidv4(), 
        value: '',
        isActive: true,
      },
    ]);
  };

  const onDeleteClick = (idToDelete) => {
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

  const handleDragEnd = (event) => {
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={formState.filter((v) => v.isActive).map((v) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          {formState.length > 0 && (
            <ol className="list-decimal mb-6 text-gray-700 dark:text-gray-300">
              {formState.filter((v) => v.isActive).map((v) => (
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
      <Button type="button" onClick={onAddClick}>Add {sectionName}</Button>
    </div>
  );
}

export default EditableSectionForm;