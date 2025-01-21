import React, { useState } from "react";
import "./style.css";
import TabNavigation from "./TabNavigation";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";

const GetCookingModal = ({ recipe }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTab, setActiveTab] = useState("ingredients"); // Tab state for mobile

  const toggleCheck = (index) => {
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
