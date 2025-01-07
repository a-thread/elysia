import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableStep from '../../../shared/components/SortableStep';
import AddStepForm from '../../../shared/components/AddStepForm';
import { useModalManager } from '../../../shared/components/modalManager';
import Button from '../../../shared/components/Button';

function StepsSectionForm({ steps, stepAdded, stepsReordered, stepUpdated, stepDeleted }) {
  const { openModal, closeModal } = useModalManager();

  const handleAddStepClick = () =>
    openModal(<AddStepForm onAddStep={handleStepAdded} />);

  const handleEditStepClick = (step) => {
    openModal(<AddStepForm step={step} onAddStep={handleStepEdited} />)
  };

  const handleStepAdded = (instruction) => {
    stepAdded(instruction);
    closeModal();
  };

  const handleStepEdited = (updatedStep) => {
    stepUpdated(updatedStep);
    closeModal();
  };

  const handleStepDeleted = (stepId) => {
    stepDeleted(stepId);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((step) => step.id === active.id);
    const newIndex = steps.findIndex((step) => step.id === over.id);

    const reorderedSteps = arrayMove(steps, oldIndex, newIndex);
    stepsReordered(reorderedSteps);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Steps
      </h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={steps.map((step) => step.id)}
          strategy={verticalListSortingStrategy}
        >
          {steps.length > 0 && (
            <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300">
              {steps.map((step) => (
                <SortableStep
                  key={step.id}
                  id={step.id}
                  step={step}
                  onEditStep={handleEditStepClick}
                  onDeleteStep={handleStepDeleted}
                />
              ))}
            </ol>
          )}
        </SortableContext>
      </DndContext>
      <Button onClick={handleAddStepClick}>Add Step</Button>
    </div>
  );
}

export default StepsSectionForm;
