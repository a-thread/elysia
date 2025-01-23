import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
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
      <TrashButton onClick={() => onDeleteClick(formValue.id)} />
    </li>
  );
};

export default SortableItem;
