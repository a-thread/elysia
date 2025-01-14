import React, { createContext, useContext, useState } from 'react';
import Modal from '../components/Modal';

const ModalManagerContext = createContext();

export const ModalManager = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(() => content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalManagerContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <Modal onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </ModalManagerContext.Provider>
  );
};

export const useModalManager = () => {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error('useModalManager must be used within a ModalManager');
  }
  return context;
};
