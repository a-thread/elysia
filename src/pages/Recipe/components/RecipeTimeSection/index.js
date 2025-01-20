import React from "react";
import formatMinutes from "../../utils/formatMinutes";
import { Button } from "../../../../shared/components/Buttons";
import { useModalManager } from "../../../../shared/services/modalManager";
import GetCookingModal from "../GetCookingModal";
import { FireIcon } from "@heroicons/react/24/outline";
import TimeLabelValue from "./TimeLabelValue";

function RecipeTimeSection({ recipe }) {
  const { openModal, closeModal } = useModalManager();

  const onCookClick = () => {
    openModal(
      <GetCookingModal recipe={recipe} onClose={closeModal} />,
      "large"
    );
  };

  return (
    <div className="pb-5 pt-4 px-5 bg-white dark:bg-gray-900 rounded-lg dark:border dark:border-dashed dark:border-2 dark:border-leafGreen-100">
      <div className="mb-2">
        <TimeLabelValue label="servings" value={recipe.servings} />
      </div>
      <div className="mb-2">
        <TimeLabelValue
          label="prep time"
          value={formatMinutes(recipe.prep_time)}
        />
      </div>
      <div className="mb-3">
        <TimeLabelValue
          label="total time"
          value={formatMinutes(recipe.total_time)}
        />
      </div>
      <Button btnType="secondary" onClick={onCookClick}>
        Get Cookin
        <FireIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default RecipeTimeSection;