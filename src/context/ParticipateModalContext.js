"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ParticipateModalContext = createContext({
  isOpen: false,
  selectedCategory: null,
  openModal: (categoryName) => {},
  closeModal: () => {},
});

export function ParticipateModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const openModal = (categoryName = null) => {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }

    if (typeof categoryName === "string") {
      router.push(`/participate?category=${encodeURIComponent(categoryName)}`);
    } else {
      router.push("/participate");
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

