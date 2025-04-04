/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {  formatDistanceToNow } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import { EditIcon, ExpandIcon, CollapseIcon, TimeIcon } from "@/icons";
import { Task } from "@/@types";
import { useAppContext } from "@/contexts/AppContext";

interface SubTaskItemProps {
  task: Task;
  nestingLevel: number;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ task, nestingLevel }) => {
  const { updateTask } = useTasks();
  const { showContextMenu, openModal } = useAppContext();
  const [expanded, setExpanded] = useState(true); // Default to expanded
  const { useSubtasks } = useTasks();
  const { data: subtasks = [], isLoading: isLoadingSubtasks } = useSubtasks(task.id);

  const handleTaskComplete = (checked: boolean) => {
    updateTask({
      id: task.id,
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("editTask", task);
  };

  // Get completed subtasks count for progress indicator
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const hasSubtasks = subtasks.length > 0;

  // Format the timestamp
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
    <div className="mb-2" onContextMenu={handleContextMenu}>
      {/* Main task item */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-3 flex items-start">
          <Checkbox 
            className="mt-1 mr-3 h-5 w-5 rounded border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-white"
            checked={Boolean(task.completed)}
            onCheckedChange={handleTaskComplete}
            id={`subtask-${task.id}`}
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className={`font-medium ${task.completed ? "line-through text-zinc-400" : ""}`}>
                {task.title}
              </h4>
              
              <div className="flex items-center">
                <button 
                  className="p-1 text-zinc-400 hover:text-zinc-100"
                  onClick={handleEditClick}
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                
                {(hasSubtasks || !task.completed) && (
                  <button 
                    className="p-1 text-zinc-400 hover:text-zinc-100"
                    onClick={toggleExpanded}
                  >
                    {expanded ? <CollapseIcon className="h-4 w-4" /> : <ExpandIcon className="h-4 w-4" />}
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

      {/* Further nested subtasks */}
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

export default SubTaskItem;
