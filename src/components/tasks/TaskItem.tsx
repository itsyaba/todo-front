/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {  formatDistanceToNow } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import SubTaskItem from "./SubTaskItem";
import { ExpandIcon, CollapseIcon, TimeIcon } from "@/icons";
import { Task } from "@/@types";
import { useAppContext } from "@/contexts/AppContext";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Edit3Icon, Plus, Trash } from "lucide-react";

interface TaskItemProps {
  task: Task;
  isSubtask?: boolean;
  nestingLevel?: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  isSubtask = false,
  nestingLevel = 0 
}) => {
  const { updateTask } = useTasks();
  const { showContextMenu, openModal } = useAppContext();
  const [expanded, setExpanded] = useState(true); // Default to expanded to show subtasks
  const { useSubtasks } = useTasks();
  const { data: subtasks =[] , isLoading: isLoadingSubtasks } = useSubtasks(task.id);


  console.log(subtasks);
  
  const handleTaskComplete = (checked: boolean) => {
    updateTask({
      id: task._id,
      task: { completed: checked }
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
    // e.stopPropagation();
    console.log("Edit task : " , task);
    
    openModal("editTask", task);
  };

  const handleCreateSubTask = (e :React.MouseEvent)=>{
    e.stopPropagation();
    console.log("CREATE SUB TASK : " , task);
    openModal("createSubTask" , task , isSubtask)
  }

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      // openModal("delete" , task)
    };

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const hasSubtasks = subtasks.length > 0;

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
    <div className="mb-3" onContextMenu={handleContextMenu}>
      <div
        className={`bg-white shadow-md dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg overflow-hidden`}
      >
        <div className="p-3 flex items-start">
          <Checkbox
            className="mt-1 mr-3 h-5 w-5 rounded border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-white"
            checked={Boolean(task.completed)}
            onCheckedChange={handleTaskComplete}
            id={`task-${task.id}`}
          />

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3
                className={`font-medium ${
                  task.completed ? "line-through text-zinc-400" : ""
                }`}
              >
                {task.title}
              </h3>

              <div className="flex items-center">
                <button
                  className="p-1 text-zinc-400 hover:text-zinc-100"
                >
                  {/* <EditIcon className="h-4 w-4" /> */}
                  <TaskOptions
                    onEdit={handleEditClick}
                    onCreateSubtask={() =>
                      handleCreateSubTask
                    }
                    onDelete={() => handleDelete}
                  />
                </button>

                {(hasSubtasks || !task.completed) && (
                  <button
                    className="p-1 text-zinc-400 hover:text-zinc-100"
                    onClick={toggleExpanded}
                  >
                    {expanded ? (
                      <CollapseIcon className="h-4 w-4" />
                    ) : (
                      <ExpandIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {!task.completed && (
              <div className="mt-1 text-sm text-zinc-400 flex items-center">
                {hasSubtasks && (
                  <div className="flex items-center mr-3">
                    <span className="inline-block w-5 h-5 mr-1">
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

      {/* Subtasks - render directly under the parent with indentation */}
      {expanded && !isLoadingSubtasks && subtasks.length > 0 && (
        <div className="pl-6 mt-2 space-y-2">
          {subtasks.map((subtask) => (
            <SubTaskItem
              key={subtask.id}
              task={subtask}
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
