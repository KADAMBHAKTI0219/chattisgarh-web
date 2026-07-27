"use client";

import { createContext, useContext, useState } from "react";

const ParticipateModalContext = createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function ParticipateModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ParticipateModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ParticipateModalContext.Provider>
  );
}

export function useParticipateModal() {
  return useContext(ParticipateModalContext);
}
