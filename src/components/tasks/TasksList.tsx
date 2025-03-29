import React from "react";
import { useTasks } from "@/hooks/useTasks";
import TaskItem from "./TaskItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Mailbox } from "lucide-react";

interface TasksListProps {
  collectionId?: string;
  // TODO fix this shit up
}

const TasksList: React.FC<TasksListProps> = ({ collectionId }) => {
  const { tasks, isLoading } = useTasks();
  
  const collectionTasks = tasks.filter(
    (task) => task.collectionId === collectionId
  );

  
  // Split tasks into completed and not completed
  const completedTasks = collectionTasks.filter((task) => task.completed );
  const incompleteTasks = collectionTasks.filter((task) => !task.completed);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-2 text-zinc-800 dark:text-zinc-400">Tasks</h2>
          <Skeleton className="h-20 w-full rounded-lg mb-3" />
          <Skeleton className="h-20 w-full rounded-lg mb-3" />
        </div>
        
        <div>
          <h2 className="text-sm font-medium mb-2 text-zinc-400">Completed</h2>
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-zinc-900 dark:text-zinc-100">
      {/* Incomplete Tasks */}
      <div>
        <h2 className="text-sm font-medium mb-2 dark:text-zinc-400">
          Tasks • {incompleteTasks.length}
        </h2>
        
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-zinc-400 text-center py-8 border border-zinc-800 rounded-lg flex items-center justify-center gap-2 flex-col">
            <Mailbox className="size-48 text-zinc-500" />
            <p className="text-md">No active tasks. Add a new task to get started.</p>
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-2 text-zinc-400">
            Completed • {completedTasks.length}
          </h2>
          
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;
