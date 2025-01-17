import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableStep from './components/SortableStep';
import { Button } from '../Buttons';

function StepsSectionForm({ steps, setSteps }) {
  const [formState, setFormState] = useState(steps);

  useEffect(() => {
    setFormState(steps);
  }, [steps]);

  // Debounce function to emit new values every 400ms
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSteps(formState);
    }, 400);

    return () => clearTimeout(debounceTimer); // Cleanup timer on component unmount or formState change
  }, [formState, setSteps]);

  const onEditChange = (updatedStep) => {
    setFormState((prevState) =>
      prevState.map((step) =>
        step.id === updatedStep.id ? { ...step, instruction: updatedStep.instruction } : step
      )
    );
  }

  const onAddClick = () => {
    setFormState((prevState) => [
      ...prevState,
      { id: Date.now().toString(), instruction: '' },
    ]);
  };

  const onDeleteClick = (stepId) => {
    setFormState((prevState) => prevState.filter((step) => step.id !== stepId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formState.findIndex((step) => step.id === active.id);
    const newIndex = formState.findIndex((step) => step.id === over.id);

    setFormState(arrayMove(formState, oldIndex, newIndex));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Steps
      </h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={formState.map((step) => step.id)}
          strategy={verticalListSortingStrategy}
        >
          {formState.length > 0 && (
            <ol className="list-decimal mb-6 text-gray-700 dark:text-gray-300">
              {formState.map((step) => (
                <SortableStep
                  key={step.id}
                  id={step.id}
                  step={step}
                  onEditStep={onEditChange}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </ol>
          )}
        </SortableContext>
      </DndContext>
      <Button type="button" onClick={onAddClick}>Add Step</Button>
    </div>
  );
}

export default StepsSectionForm;