import React, { createContext, useContext, useState } from "react";
import Modal from "../components/Modal";

const ModalManagerContext = createContext();

export const ModalManager = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalSize, setModalSize] = useState("small");

  const openModal = (content, size = "small") => {
    setModalContent(() => content);
    setModalSize(size);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalSize("small");
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

export const useModalManager = () => {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error("useModalManager must be used within a ModalManager");
  }
  return context;
};
