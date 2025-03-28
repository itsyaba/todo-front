import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";
import CollectionItem from "./CollectionItem";
import { useCollections } from "@/hooks/useCollections";
import { useAppContext } from "@/contexts/AppContext";
import { Collection } from "@/@types";
import { AddIcon } from "@/icons";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const CollectionsList: React.FC = () => {
  const { collections, isLoading } = useCollections();
  const { openModal } = useAppContext();
  const [expanded, setExpanded] = useState(true);
  const [, setLocation] = useLocation();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCreateCollection = () => {
    openModal("createCollection");
  };

  const navigateToCollection = (collection: Collection) => {
    setLocation(`/collections/${collection._id}`);
  };

console.log("collections id : " , collections);

  if (collections.length === 0) return null

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-50 dark:bg-gray-900/40 text-black dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/40 border-b border-zinc-800">
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-medium text-base">Collections</h2>
          <button
            className="text-zinc-400 hover:text-zinc-100"
            onClick={toggleExpanded}
          >
            {expanded ? (
              <ChevronDown className="transform transition-all duration-200" />
            ) : (
              <ChevronUp className="transform transition-all duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Collections List */}
      <div className="flex-1 overflow-y-auto">
        {expanded && (
          <div className="p-4">
            <nav className="space-y-2">
              {isLoading ? (
                // Loading skeletons
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <>
                  {collections?.map((collection) => (
                    <CollectionItem
                      key={collection._id}
                      collectionName={collection.name}
                      collection={collection}
                      onClick={() => navigateToCollection(collection)}
                    />
                  ))}

                  {/* Add collection button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    onClick={handleCreateCollection}
                  >
                    <AddIcon className="mr-3" />
                    <span>Add Collection</span>
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsList;
