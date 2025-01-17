import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
import { TrashButton, IconButton } from "../../Buttons";
import AutoResizeTextarea from "./AutoResizeTextbox";

function SortableStep({ id, step, onEditStep, onDeleteClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || "all 0.2s ease",
  };

  const onInputChange = (event) => {
    onEditStep({ ...step, instruction: event.target.value });
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="text-gray-700 dark:text-gray-300 flex items-center justify-between mb-2"
    >
      <AutoResizeTextarea onChange={onInputChange} value={step.instruction} placeholder=" " />

      {/* Drag Handle */}
      <IconButton
        icon={<HandRaisedIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
        title="Drag Step"
        attributes={attributes}
        listeners={listeners}
      />

      {/* Delete Button */}
      <TrashButton onDelete={() => onDeleteClick(step.id)} />
    </li>
  );
}

export default SortableStep;
