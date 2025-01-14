import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import IconButton from "./IconButton";

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
      <textarea
        className="border rounded px-2 py-1 w-full mr-3 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
        placeholder=" "
        value={step.instruction || ""}
        onChange={onInputChange}
      ></textarea>

      {/* Drag Handle */}
      <IconButton
        icon={<HandRaisedIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
        title="Drag Step"
        attributes={attributes}
        listeners={listeners}
      />

      {/* Delete Button */}
      <IconButton
        icon={<TrashIcon className="w-6 h-6 text-red-500 dark:text-red-600" />}
        onClick={() => onDeleteClick(step.id)}
        title="Delete Step"
      />
    </li>
  );
}

export default SortableStep;
