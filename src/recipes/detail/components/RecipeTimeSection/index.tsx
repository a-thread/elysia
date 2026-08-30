import React from "react";
import { useNavigate } from "react-router-dom";
import formatMinutes from "../../utils/formatMinutes";
import GetCookingModal from "../GetCookingModal";
import { FaFire } from "react-icons/fa";
import TimeLabelValue from "./TimeLabelValue";
import { Recipe } from "@shared/models/Recipe";
import { useModalManager } from "@shared/components/Modals";
import { ModalSize } from "@shared/components/Modals/BaseModal/ModalSize";
import { Button, TagButton } from "@shared/components/Buttons";
import Card from "@shared/components/Card";

const RecipeTimeSection: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { openModal } = useModalManager();
  const navigate = useNavigate();

  const onCookClick = () => {
    openModal(<GetCookingModal recipe={recipe} />, ModalSize.Large);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full shadow-md"
        onClick={onCookClick}
      >
        Get Cookin
        <FaFire className="h-5 w-5" />
      </Button>

      <Card className="py-4 px-5">
        {recipe.servings > 0 && (
          <div className="mb-2">
            <TimeLabelValue label="servings" value={recipe.servings} />
          </div>
        )}
        {recipe.prep_time > 0 && (
          <div className="mb-2">
            <TimeLabelValue
              label="prep time"
              value={formatMinutes(recipe.prep_time)}
            />
          </div>
        )}
        {recipe.total_time! > 0 && (
          <div className="mb-3">
            <TimeLabelValue
              label="total time"
              value={formatMinutes(recipe.total_time)}
            />
          </div>
        )}
      </Card>

      {recipe.collections && recipe.collections.length > 0 && (
        <Card className="pt-2 pb-4 px-5">
          <div className="mb-1">
            <small className="text-leaf-green-800 dark:text-leaf-green-100">
              collections
            </small>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.collections.map((collection) => (
              <TagButton
                key={collection.id}
                title={collection.title}
                isReadOnly={true}
                onClick={() => {
                  navigate(`/collections/${collection.id}`);
                }}
              />
            ))}
          </div>
        </Card>
      )}

      {recipe.tags && recipe.tags.length > 0 && (
        <Card className="pt-2 pb-4 px-5">
          <div className="mb-1">
            <small className="text-leaf-green-800 dark:text-leaf-green-100">
              tags
            </small>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <TagButton
                key={tag.id}
                title={tag.title}
                isReadOnly={true}
                onClick={() => {
                  navigate("/recipes", { state: { selectedTags: [tag] } });
                }}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecipeTimeSection;
