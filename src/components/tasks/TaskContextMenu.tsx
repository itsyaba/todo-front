import React, { useEffect, useRef } from "react";
import { useTasks } from "@/hooks/useTasks";
// import { AddIcon, EditIcon, DeleteIcon, ChevronRightIcon } from "@/icons";
import { useAppContext } from "@/contexts/AppContext";

const TaskContextMenu: React.FC = () => {
  const { contextMenuPosition, hideContextMenu, contextMenuTask, openModal } = useAppContext();
  const { deleteTask } = useTasks();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideContextMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [hideContextMenu]);

  if (!contextMenuPosition || !contextMenuTask) {
    return null;
  }

  const handleAddSubtask = () => {
    if (contextMenuTask) {
      // Pass createTask as the modal type and the contextMenuTask for parentId reference
      openModal("createTask", contextMenuTask);
    }
    hideContextMenu();
  };

  const handleEditTask = () => {
    if (contextMenuTask) {
      openModal("editTask", contextMenuTask);
    }
    hideContextMenu();
  };

  const handleDeleteTask = () => {
    if (contextMenuTask) {
      deleteTask(contextMenuTask.id);
    }
    hideContextMenu();
  };

  const style = {
    top: `${contextMenuPosition.y}px`,
    left: `${contextMenuPosition.x}px`,
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-32 bg-zinc-900 border border-zinc-800 shadow-md rounded-sm py-1 overflow-hidden"
      style={style}
    >
      <button
        className="w-full text-left px-3 py-1 text-sm hover:bg-zinc-800 flex items-center text-zinc-300"
        onClick={handleAddSubtask}
      >
        <span className="w-4 opacity-0">▷</span>
        Add sub-task
      </button>
      <button
        className="w-full text-left px-3 py-1 text-sm hover:bg-zinc-800 flex items-center text-zinc-300"
        onClick={handleEditTask}
      >
        <span className="w-4">▷</span>
        Edit task
      </button>
      <button
        className="w-full text-left px-3 py-1 text-sm hover:bg-zinc-800 flex items-center text-zinc-400"
        onClick={handleDeleteTask}
      >
        <span className="w-4 opacity-0">▷</span>
        Delete task
      </button>
    </div>
  );
};

export default TaskContextMenu;
