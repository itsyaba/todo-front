import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getSubtasks, getTasks, updateTask, createSubtask } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskInsert, TaskUpdate } from "@/@types";

export const useTasks = (collectionId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tasksQuery = useQuery<Task[]>({
    queryKey: collectionId ? ["task", collectionId] : ["task"],
    queryFn: () => getTasks(collectionId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (task : TaskInsert) => createTask(task),
    onSuccess: () => {
      if (collectionId) {
        queryClient.invalidateQueries({ queryKey: ["task", collectionId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["task"] });
      }
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      
      toast({
        title: "Failed to create task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const createSubtaskMutation = useMutation({
    mutationFn: ({ parentId, task }: { parentId: number; task: Omit<TaskUpdate, "userId"> }) =>
      createSubtask(parentId, task),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.parentId, "subtasks"] });
      if (collectionId) {
        queryClient.invalidateQueries({ queryKey: ["task", collectionId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["task"] });
      }
      toast({
        title: "Subtask created",
        description: "Your subtask has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create subtask",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<TaskInsert> }) => updateTask(id, task),
    onSuccess: (updatedTask) => {
      if (updatedTask?.parentId) {
        queryClient.invalidateQueries({ queryKey: ["task", updatedTask.parentId, "subtasks"] });
      }
      
      if (collectionId) {
        queryClient.invalidateQueries({ queryKey: ["task", collectionId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["task"] });
      }
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: (_, id) => {
      const task = tasksQuery.data?.find(t => t.id === id);
      
      if (task?.parentId) {
        queryClient.invalidateQueries({ queryKey: ["task", task.parentId, "subtasks"] });
      }
      
      if (collectionId) {
        queryClient.invalidateQueries({ queryKey: ["task", collectionId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["task"] });
      }
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const useSubtasks = (taskId: number) => {
    return useQuery<Task[]>({
      queryKey: ["task", taskId, "subtasks"],
      queryFn: () => getSubtasks(taskId),
    });
  };

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutate,
    createSubtask: createSubtaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    useSubtasks,
    isPending: 
      createTaskMutation.isPending || 
      updateTaskMutation.isPending || 
      deleteTaskMutation.isPending ||
      createSubtaskMutation.isPending,
  };
};
