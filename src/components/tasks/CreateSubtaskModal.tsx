// @ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { createNestedSubtask } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Subtask title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateSubtaskModal: React.FC = () => {
  const { closeModal, activeTask } = useAppContext();
  const { createSubtask } = useTasks();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!activeTask?.taskId) {
      toast({
        title: "Error",
        description: "No parent task selected",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare the task data
      const taskData = {
        title: data.title,
        description: data.description || "",
        dueDate: data.dueDate,
        completed: false
      };

      // Create the subtask with the appropriate parameters
      await createSubtask({
        taskId: activeTask.taskId,
        mainTaskId: activeTask.mainTaskId,
        isNested: activeTask.isNested,
        task: taskData
      });

      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subtask",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent
        className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-lg"
        aria-describedby="subtask-form-description"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Create {activeTask?.isNested ? 'Nested' : ''} Subtask
          </DialogTitle>
          <p
            id="subtask-form-description"
            className="text-sm text-gray-500 dark:text-zinc-400"
          >
            Add a subtask to {activeTask?.title}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtask Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Research competitors"
                      className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about this subtask"
                      className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 focus:ring-primary h-20"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="bg-transparent text-zinc-100 border-zinc-700 hover:bg-zinc-700/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-zinc-700 text-white hover:bg-zinc-700/30"
              >
                Create Subtask
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubtaskModal;
