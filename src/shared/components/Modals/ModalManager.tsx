import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "./BaseModal";
import { ModalSize } from "./BaseModal/ModalSize";

// Define the context type
interface ModalManagerContextType {
  openModal: (content: ReactNode, size?: ModalSize) => void;
  closeModal: () => void;
}

// Create a context with a default empty object and assert it as ModalManagerContextType
const ModalManagerContext = createContext<ModalManagerContextType | undefined>(undefined);

// Define props for ModalManager
interface ModalManagerProps {
  children: ReactNode;
}

export const ModalManager: React.FC<ModalManagerProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalSize, setModalSize] = useState<ModalSize>(ModalSize.Small);

  const openModal = (content: ReactNode, size: ModalSize = ModalSize.Small) => {
    setModalContent(() => content);
    setModalSize(size);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalSize(ModalSize.Small);
  };

  return (
    <ModalManagerContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <Modal onClose={closeModal} size={modalSize}>
          {modalContent}
        </Modal>
      )}
    </ModalManagerContext.Provider>
  );
};

export const useModalManager = (): ModalManagerContextType => {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error("useModalManager must be used within a ModalManager");
  }
  return context;
};
