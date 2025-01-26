import React from "react";
import formatMinutes from "../../utils/formatMinutes";
import GetCookingModal from "../GetCookingModal";
import { FireIcon } from "@heroicons/react/24/outline";
import TimeLabelValue from "./TimeLabelValue";
import { Recipe } from "@shared/models/Recipe";
import { useModalManager } from "@shared/components/Modals";
import { ModalSize } from "@shared/components/Modals/BaseModal/ModalSize";
import { Button, TagButton } from "@shared/components/Buttons";

const RecipeTimeSection: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { openModal } = useModalManager();

  const onCookClick = () => {
    openModal(<GetCookingModal recipe={recipe} />, ModalSize.Large);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 px-5 bg-white dark:bg-gray-900 rounded-lg dark:border dark:border-dashed dark:border-2 dark:border-leaf-green-100">
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
      </div>
      <Button
        className="w-full bg-white"
        btnType="secondary"
        onClick={onCookClick}
      >
        Get Cookin
        <FireIcon className="h-5 w-5" />
      </Button>

      {recipe.collections && (
        <div>
          <h4>Collections</h4>
          <div className="flex gap-2">
            {recipe.collections.map((collection) => (
              <TagButton
                key={collection.id}
                title={collection.title}
                isReadOnly={true}
              />
            ))}
          </div>
        </div>
      )}

      {recipe.tags && (
        <div>
          <h4>Tags</h4>
          <div className="flex gap-2">
            {recipe.tags.map((tag) => (
              <TagButton key={tag.id} title={tag.title} isReadOnly={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeTimeSection;