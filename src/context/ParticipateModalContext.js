"use client";

import { createContext, useContext, useState } from "react";

const ParticipateModalContext = createContext({
  isOpen: false,
  selectedCategory: null,
  openModal: (categoryName) => {},
  closeModal: () => {},
});

export function ParticipateModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = (categoryName = null) => {
    if (typeof categoryName === "string") {
      setSelectedCategory(categoryName);
    } else {
      setSelectedCategory(null);
    }
    setIsOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  return (
    <ParticipateModalContext.Provider value={{ isOpen, selectedCategory, openModal, closeModal }}>
      {children}
    </ParticipateModalContext.Provider>
  );
}

export function useParticipateModal() {
  return useContext(ParticipateModalContext);
}

