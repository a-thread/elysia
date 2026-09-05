import React from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import { AddRecipeModal, useModalManager } from "@shared/components/Modals";
import Fab from "./Fab";

const AddRecipeFab: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModalManager();

  if (!isAuthenticated) return null;

  return (
    <Fab
      label="New Recipe"
      onClick={() => openModal(<AddRecipeModal onClose={closeModal} />)}
    />
  );
};

export default AddRecipeFab;
