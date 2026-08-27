import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaHandPaper } from "react-icons/fa";
import AutoResizeTextarea from "./AutoResizeTextbox";
import { IconButton, TrashButton } from "@shared/components/Buttons";
import { StepIngredient } from "@shared/models/StepIngredient";

interface SortableItemProps {
  id: string;
  formValue: StepIngredient;
  onEditFormValue: (value: StepIngredient) => void;
  onDeleteClick: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  formValue,
  onEditFormValue,
  onDeleteClick,
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
      className="text-gray-700 dark:text-gray-300 flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 mb-2"
    >
      {/* Drag Handle */}
      <IconButton
        icon={
          <FaHandPaper className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        }
        title="Drag Step"
        attributes={attributes}
        listeners={listeners}
      />

      <AutoResizeTextarea
        onChange={onInputChange}
        value={formValue.value}
        placeholder=" "
      />

      {/* Delete Button */}
      <TrashButton onClick={() => onDeleteClick(formValue.id)} />
    </li>
  );
};

export default SortableItem;
