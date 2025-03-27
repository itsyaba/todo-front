import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollection, deleteCollection, getCollections, updateCollection } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Collection, CollectionInsert } from "@/@types";

export const useCollections = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const collectionsQuery = useQuery<Collection[]>({
    queryKey: ["/collections"],
    queryFn: () => getCollections(),
  });

  const createCollectionMutation = useMutation({    
    mutationFn: (collection: CollectionInsert) => createCollection(collection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/collections"] });
      toast({
        title: "Collection created",
        description: "Your collection has been created successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to create collection",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: (id : string) =>      
      updateCollection(id, {isFavorite : true}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/collections"] });
      toast({
        title: "Collection updated",
        description: "Your collection has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to update collection",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (id: number) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/collections"] });
      toast({
        title: "Collection deleted",
        description: "Your collection has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete collection",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    collections: collectionsQuery.data || [],
    isLoading: collectionsQuery.isLoading,
    isError: collectionsQuery.isError,
    createCollection: createCollectionMutation.mutate,
    updateCollection: updateCollectionMutation.mutate,
    deleteCollection: deleteCollectionMutation.mutate,
    // isPending: createCollectionMutation.isPending || updateCollectionMutation.isPending || deleteCollectionMutation.isPending,
  };
};
