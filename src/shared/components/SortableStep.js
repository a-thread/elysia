import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PencilIcon } from "@heroicons/react/20/solid";
import { TrashIcon, HandRaisedIcon } from "@heroicons/react/24/outline";

function SortableStep({ id, step, onEditStep, onDeleteStep }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || "all 0.2s ease",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="relative text-gray-700 dark:text-gray-200 mb-2 p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <span>{step.instruction}</span>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm rounded-full cursor-move hover:bg-gray-300 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          title="Drag Step"
        >
          <HandRaisedIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditStep(step);
          }}
          className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          title="Edit Step"
        >
          <PencilIcon className="w-5 h-5 text-yellow-400 dark:text-yellow-500" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteStep(step.id);
          }}
          className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          title="Delete Step"
        >
          <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-600" />
        </button>
      </div>
    </li>
  );
}

export default SortableStep;
