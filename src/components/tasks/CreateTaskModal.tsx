// @ts-nocheck
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useAppContext } from "@/contexts/AppContext";
import { useTasks } from "@/hooks/useTasks";
import { useCollections } from "@/hooks/useCollections";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface CreateTaskModalProps {
  isEditing?: boolean;
  isSubtask?: boolean;
  parentId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().optional().nullable(),
  collectionId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;



const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isEditing = false, parentId}) => {
  const { closeModal, activeTask} =
    useAppContext();
  const { createTask, updateTask, createSubtask } = useTasks();
  const { collections } = useCollections();

  // Helper function to parse the ID from the URL
const getCollectionIdFromUrl = (): string | undefined => {
   const pathSegments = window.location.pathname.split("/");
   const idSegment = pathSegments[2];

   if (!idSegment || !/^[0-9a-fA-F]{24}$/.test(idSegment)) {
     return undefined;
   }

   return idSegment; 
 };

 
  const parentTaskId = parentId;

  const getDefaultValues = () => {
    if (isEditing && activeTask) {
      return {
        title: activeTask.title || "",
        description: activeTask.description || "",
        priority:
          (activeTask.priority as "low" | "medium" | "high") || "medium",
        dueDate: activeTask.dueDate ? new Date(activeTask.dueDate) : null,
        collectionId: getCollectionIdFromUrl(),
      };
    }

    return {
      title: "",
      description: "",
      priority: "medium" as const,
      dueDate: null,
      collectionId: getCollectionIdFromUrl(),
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing && activeTask) {
      updateTask({
        id: activeTask._id,
        task: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          // dueDate: data.dueDate,
          collectionId:  getCollectionIdFromUrl(),
        },
      });
    } else if (parentTaskId) {
      console.log(parentTaskId);
      // Use the parentTaskId which includes fallback to contextMenuTask.id
      createSubtask({
        parentId: parentTaskId,
        task: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          // dueDate: data.dueDate,
          collectionId:  getCollectionIdFromUrl(),
        },
      });
    } else {
      createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        // dueDate: data.dueDate,
        collectionId:  getCollectionIdFromUrl(),
        completed: false,
        userId: 0,
      });
    }
    closeModal();
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 max-w-lg"
        aria-describedby="task-form-description"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {isEditing
              ? "Edit Task"
              : parentTaskId
              ? "Create Subtask"
              : "Create New Task"}
          </DialogTitle>
          <p id="task-form-description" className="text-sm text-zinc-400">
            {isEditing
              ? "Update your task details below."
              : parentTaskId
              ? "Add a subtask to organize your work hierarchically."
              : "Create a new task to track your work."}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Complete project proposal"
                      className="bg-zinc-800 border-zinc-700 focus:ring-primary"
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
                      placeholder="Add more details about this task"
                      className="bg-zinc-800 border-zinc-700 focus:ring-primary h-20"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-row items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-2/4">
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-primary">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-2/4 pt-2">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "bg-zinc-800 border-zinc-700 text-left font-normal",
                              !field.value && "text-zinc-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className="bg-zinc-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-primary">
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {collections.map((collection) => (
                        <SelectItem
                          key={collection._id}
                          value={collection._id.toString()}
                        >
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
