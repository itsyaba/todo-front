// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {  formatDistanceToNow } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import { TimeIcon } from "@/icons";
import { Task } from "@/@types";
import { useAppContext } from "@/contexts/AppContext";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronUp, Edit, Edit3Icon, Layers, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask } from "@/lib/api";

interface TaskItemProps {
  task: Task;
  isSubtask?: boolean;
  nestingLevel?: number;
}

// Add proper type for the event handler
type CheckedState = boolean | 'indeterminate';

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  isSubtask = false,
  nestingLevel = 0 
}) => {
  const { updateTask } = useTasks();
  const { showContextMenu, openModal } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  
  // Use the subTasks array directly from the task object
  const subtasks = task.subTasks || [];
  const hasSubtasks = subtasks.length > 0;
  const completedSubtasks = subtasks.filter(st => st.completed).length;

  const handleTaskComplete = (checked: CheckedState) => {
    updateTask({
      id: task._id,
      task: { completed: checked === true }
    });
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, task);
  };

  const handleEditClick = () => {
    e.stopPropagation();
    console.log("Edit task : " , task);
    openModal("editTask", task);
  };

  const handleCreateSubTask = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // If this is a subtask (isSubtask is true), use createNestedSubtask
    if (isSubtask) {
      console.log("Creating nested subtask for task:", task);
      openModal("createSubtask", {
        ...task,
        _id: task._id,
        mainTaskId: task.mainTaskId || task._id,
        parentId: task._id,
        isNestedSubtask: true // Flag to indicate this is a nested subtask
      });
    } else {
      // For main tasks, use regular subtask creation
      console.log("Creating regular subtask for task:", task);
      openModal("createSubtask", {
        ...task,
        _id: task._id,
        mainTaskId: task._id,
        parentId: task._id,
        isNestedSubtask: false
      });
    }
    setExpanded(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const getTimeAgo = () => {
    if (!task.createdAt) return "";
    try {
      return formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  const timeAgo = getTimeAgo();
  const timeColor = task.priority === "high" ? "text-red-500" : 
                   task.priority === "medium" ? "text-amber-500" : 
                   "text-green-500";

  return (
    <div className={`
      relative bg-zinc-900 mb-3 rounded-md cursor-pointer
      ${isSubtask ? 'ml-6' : 'mb-3  '}
    `} onContextMenu={handleContextMenu}
                    onClick={toggleExpanded}
    
    >
      <div className={`
        // bg-zinc-900 
        rounded-md 
        ${isSubtask ? 'border-l-4 border-l-zinc-700 dark:bg-zinc-800 mb-1 mr-2 ' : 'mt-1'}
      `}>
        <div className="p-2 flex items-start ">
          <div className="flex-1 ">
            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <Checkbox
                  className="mt-1 mr-3 h-5 w-5 rounded border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  checked={Boolean(task.completed)}
                  onCheckedChange={handleTaskComplete}
                  id={`task-${task._id}`}
                />
                <h3 className={`font-medium ${task.completed ? "line-through text-zinc-400" : ""}`}>
                  {task.title}
                </h3>
              </div>

              <div className="flex items-center">
                <button className="p-1 text-zinc-400 hover:text-zinc-100">
                  <TaskOptions
                    onEdit={handleEditClick}
                    onCreateSubtask={handleCreateSubTask}
                    onDelete={handleDelete}
                  />
                </button>

                {(hasSubtasks || !task.completed) && (
                  <button
                    className="p-1 text-zinc-400 hover:text-zinc-100 "
                    onClick={toggleExpanded}
                  >
                    <ChevronUp className={`h-4 w-4 transition-all duration-300 ${expanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {!task.completed && expanded && (
              <div className="mt-1 text-sm text-zinc-400 flex items-center mx-4">
                {hasSubtasks && (
                  <div className="flex items-center mr-3">
                    <span className="flex items-center justify-between gap-2 mr-1">
                      <Layers className="size-4" />
                      {completedSubtasks}/{subtasks.length}
                    </span>
                  </div>
                )}

                {timeAgo && (
                  <span className={`flex items-center ${timeColor}`}>
                    <TimeIcon className="h-4 w-4 mr-1" />
                    {timeAgo}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks section */}
      {expanded && hasSubtasks && (
        <div className="mt-2">
          {subtasks?.map((subtask) => (
            <TaskItem
              key={subtask._id}
              task={{
                ...subtask,
                mainTaskId: task.mainTaskId || task._id,
                parentId: task._id
              }}
              isSubtask={true}
              nestingLevel={nestingLevel + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;


interface TaskOptionsProps {
  onEdit: () => void;
  onCreateSubtask: () => void;
  onDelete: () => void;
}

export const TaskOptions: React.FC<TaskOptionsProps> = ({ onEdit, onCreateSubtask, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit3Icon className="w-5 h-5 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-zinc-900 border border-zinc-800"
      >
        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onCreateSubtask}
          className="cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Subtask
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer flex items-center gap-2 text-red-500"
        >
          <Trash className="w-4 h-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
