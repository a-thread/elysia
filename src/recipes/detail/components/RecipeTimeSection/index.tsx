import React from "react";
import formatMinutes from "../../utils/formatMinutes";
import GetCookingModal from "../GetCookingModal";
import { FireIcon } from "@heroicons/react/24/outline";
import TimeLabelValue from "./TimeLabelValue";
import { Recipe } from "@shared/models/Recipe";
import { useModalManager } from "@shared/components/Modals";
import { ModalSize } from "@shared/components/Modals/BaseModal/ModalSize";
import { Button } from "@shared/components/Buttons";

const RecipeTimeSection: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { openModal } = useModalManager();

  const onCookClick = () => {
    openModal(<GetCookingModal recipe={recipe} />, ModalSize.Large);
  };

  return (
    <div className="pb-5 pt-4 px-5 bg-white dark:bg-gray-900 rounded-lg dark:border dark:border-dashed dark:border-2 dark:border-leaf-green-100">
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
};

export default RecipeTimeSection;
