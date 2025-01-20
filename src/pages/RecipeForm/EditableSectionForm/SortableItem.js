import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon as TrashSolid } from "@heroicons/react/20/solid";
import { HandRaisedIcon, TrashIcon as TrashOutline } from "@heroicons/react/24/outline";
import AutoResizeTextarea from "./AutoResizeTextbox";
import { IconButton } from "../../../shared/components/Buttons";
import { useState } from "react";

function SortableItem({ id, formValue, onEditFormValue, onDeleteClick }) {
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || "all 0.2s ease",
  };

  const onInputChange = (event) => {
    onEditFormValue({ ...formValue, value: event.target.value });
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="text-gray-700 dark:text-gray-300 flex items-center justify-between mb-2"
    >
      <AutoResizeTextarea
        onChange={onInputChange}
        value={formValue.value}
        placeholder=" "
      />

      {/* Drag Handle */}
      <IconButton
        icon={
          <HandRaisedIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        }
        title="Drag Step"
        attributes={attributes}
        listeners={listeners}
      />

      {/* Delete Button */}
      <IconButton
        onClick={() => onDeleteClick(formValue.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Delete"
        icon={
          hovered ? (
            <TrashSolid className="w-6 h-6 text-red-500" />
          ) : (
            <TrashOutline className="w-6 h-6 text-gray-500" />
          )
        }
      />
    </li>
  );
}

export default SortableItem;
