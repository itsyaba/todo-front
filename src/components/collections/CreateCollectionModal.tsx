import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCollections } from "@/hooks/useCollections";
import { CollectionIcons } from "@/icons";
import { useAppContext } from "@/contexts/AppContext";

interface CreateCollectionModalProps {
  isEditing?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ isEditing = false }) => {
  const { closeModal, activeCollection } = useAppContext();
  const { createCollection, updateCollection } = useCollections();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activeCollection?.name || "",
      icon: activeCollection?.icon || "palette",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing && activeCollection) {
      updateCollection(activeCollection._id);
    } else {
      createCollection({
        name: data.name,
        icon: data.icon,
        isFavorite: false,
        userId: 0
      });
    }
    closeModal();
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-100 max-w-md" aria-describedby="collection-form-description">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {isEditing ? "Edit Collection" : "Create New Collection"}
          </DialogTitle>
          <p id="collection-form-description" className="text-sm text-zinc-400">
            {isEditing ? "Update your collection details below." : "Create a new collection to organize your tasks."}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Work, Personal, Study"
                      className="bg-zinc-800 border-zinc-700 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries(CollectionIcons).map(([iconName, icon]) => (
                      <Button
                        key={iconName}
                        type="button"
                        variant="outline"
                        className={`p-2 aspect-square flex items-center justify-center ${
                          field.value === iconName
                            ? "bg-primary/10 border-primary"
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                        onClick={() => field.onChange(iconName)}
                      >
                        <span className={field.value === iconName ? "text-primary" : "text-zinc-400"}>
                          {icon}
                        </span>
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionModal;
