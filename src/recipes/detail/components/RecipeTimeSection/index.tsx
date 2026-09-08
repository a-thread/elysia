import React from "react";
import { useNavigate } from "react-router-dom";
import formatMinutes from "../../utils/formatMinutes";
import GetCookingModal from "../GetCookingModal";
import { FaFire } from "react-icons/fa";
import TimeLabelValue from "./TimeLabelValue";
import { Recipe } from "@recipes/models/Recipe";
import { useModalManager } from "@shared/components/Modals";
import { ModalSize } from "@shared/components/Modals/BaseModal/ModalSize";
import { Button, TagButton } from "@shared/components/Buttons";
import Card from "@shared/components/Card";

const RecipeTimeSection: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { openModal } = useModalManager();
  const navigate = useNavigate();
  const hasTimeDetails =
    recipe.servings > 1 || recipe.prep_time > 0 || recipe.total_time! > 0;
  const hasRelatedDetails =
    (recipe.collections && recipe.collections.length > 0) ||
    (recipe.tags && recipe.tags.length > 0);

  const onCookClick = () => {
    openModal(<GetCookingModal recipe={recipe} />, ModalSize.Large);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-full shadow-md" onClick={onCookClick}>
        Get Cookin
        <FaFire className="h-5 w-5" />
      </Button>

      {hasTimeDetails || hasRelatedDetails ? (
        <div className="md:hidden">
          <Card className="p-4">
            <div className="flex gap-4">
              {hasTimeDetails && (
                <div className="flex-none w-[36%] flex flex-col gap-2">
                  {recipe.servings > 1 && (
                    <TimeLabelValue label="servings" value={recipe.servings} />
                  )}
                  {recipe.prep_time > 0 && (
                    <TimeLabelValue
                      label="prep"
                      value={formatMinutes(recipe.prep_time)}
                    />
                  )}
                  {recipe.total_time! > 0 && (
                    <TimeLabelValue
                      label="total"
                      value={formatMinutes(recipe.total_time)}
                    />
                  )}
                </div>
              )}
              {hasTimeDetails && hasRelatedDetails && (
                <div className="w-px bg-gray-200 dark:bg-gray-700" />
              )}
              {hasRelatedDetails && (
                <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                  {recipe.collections && recipe.collections.length > 0 && (
                    <div>
                      <small className="text-leaf-green-800 dark:text-leaf-green-100">
                        collections
                      </small>
                      <div className="flex flex-wrap gap-1.5 mt-1">
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
                    </div>
                  )}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div>
                      <small className="text-leaf-green-800 dark:text-leaf-green-100">
                        tags
                      </small>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {recipe.tags.map((tag) => (
                          <TagButton
                            key={tag.id}
                            title={tag.title}
                            isReadOnly={true}
                            onClick={() => {
                              navigate("/recipes", {
                                state: { selectedTags: [tag] },
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : null}

      <div className="hidden md:flex md:flex-col gap-4">
        {hasTimeDetails && (
          <Card className="py-4 px-5">
            {recipe.servings > 1 && (
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
        )}

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
    </div>
  );
};

export default RecipeTimeSection;
