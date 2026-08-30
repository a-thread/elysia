import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import AutoResizeTextarea from "./AutoResizeTextbox";
import { IconButton, RemoveButton } from "@shared/components/Buttons";
import { StepIngredient } from "@shared/models/StepIngredient";

interface SortableItemProps {
  id: string;
  formValue: StepIngredient;
  onEditFormValue: (value: StepIngredient) => void;
  onDeleteClick: (id: string) => void;
  /** When set, renders a numbered badge (e.g. for Steps) instead of a plain row. */
  number?: number;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  formValue,
  onEditFormValue,
  onDeleteClick,
  number,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || "all 0.2s ease",
  };

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onEditFormValue({ ...formValue, value: event.target.value });
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="row-item text-gray-700 dark:text-gray-300 flex items-center gap-1.5 border border-gray-200 dark:border-gray-600 hover:border-leaf-green-200 dark:hover:border-leaf-green-700 transition-colors rounded-lg pl-1 pr-2 py-1 mb-2"
    >
      {/* Drag Handle */}
      <IconButton
        icon={
          <MdDragIndicator className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        }
        title="Drag to reorder"
        className="w-8 h-8 shrink-0 cursor-grab"
        attributes={attributes}
        listeners={listeners}
      />

      {number !== undefined && (
        <div
          aria-hidden="true"
          className="shrink-0 w-[22px] h-[22px] rounded-full bg-leaf-green-50 dark:bg-leaf-green-900 text-leaf-green-700 dark:text-leaf-green-300 text-[11px] font-bold flex items-center justify-center"
        >
          {number}
        </div>
      )}

      <AutoResizeTextarea
        onChange={onInputChange}
        value={formValue.value}
        placeholder=" "
        ariaLabel={number !== undefined ? `Step ${number}` : "Ingredient"}
      />

      {/* Delete Button */}
      <RemoveButton
        onClick={() => onDeleteClick(formValue.id)}
        label={
          number !== undefined ? `Delete step ${number}` : "Delete ingredient"
        }
      />
    </li>
  );
};

export default SortableItem;
