import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import { Recipe } from "@shared/models/Recipe";

interface GetCookingModalProps {
  recipe: Recipe;
}

export interface CheckedItems {
  [key: number]: boolean;
}

const GetCookingModal: React.FC<GetCookingModalProps> = ({ recipe }) => {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>(
    {}
  );
  const [activeTab, setActiveTab] = useState<string>("ingredients"); // Tab state for mobile

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full h-full p-4 pt-[1.5rem]">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="h-full flex flex-col md:flex-row gap-6">
        <MobileView
          activeTab={activeTab}
          recipe={recipe}
          checkedItems={checkedItems}
          onCheck={toggleCheck}
        />
        <DesktopView
          recipe={recipe}
          checkedItems={checkedItems}
          onCheck={toggleCheck}
        />
      </div>
    </div>
  );
};

export default GetCookingModal;
