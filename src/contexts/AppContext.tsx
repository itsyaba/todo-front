import { Collection, Task } from "@/@types";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType =
  | "createTask"
  | "editTask"
  | "createCollection"
  | "editCollection"
  | "createSubtask"
  | null;

interface AppContextType {
  activeCollection: Collection | null;
  setActiveCollection: (collection: Collection | null) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  activeModal: ModalType;
  openModal: (type: ModalType, task?: Task) => void;
  closeModal: () => void;
  contextMenuPosition: { x: number; y: number } | null;
  showContextMenu: (x: number, y: number, task: Task) => void;
  hideContextMenu: () => void;
  contextMenuTask: Task | null;
}

const defaultContext: AppContextType = {
  activeCollection: null,
  setActiveCollection: () => {},
  activeTask: null,
  setActiveTask: () => {},
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
  contextMenuPosition: null,
  showContextMenu: () => {},
  hideContextMenu: () => {},
  contextMenuTask: null,
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    null
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextMenuTask, setContextMenuTask] = useState<Task | null>(null);

  const openModal = (type: ModalType, task?: Task) => {
    if (task) {
      setActiveTask(task);
    }
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    if (activeModal === "editTask") {
      setActiveTask(null);
    }
  };

  const showContextMenu = (x: number, y: number, task: Task) => {
    setContextMenuPosition({ x, y });
    setContextMenuTask(task);
    console.log("SETTING TASK FOR CONTEXT MENU : " , task);
    
  };

  const hideContextMenu = () => {
    setContextMenuPosition(null);
    setContextMenuTask(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeCollection,
        setActiveCollection,
        activeTask,
        setActiveTask,
        activeModal,
        openModal,
        closeModal,
        contextMenuPosition,
        showContextMenu,
        hideContextMenu,
        contextMenuTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
