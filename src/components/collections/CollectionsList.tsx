import { ExpandIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";
import CollectionItem from "./CollectionItem";
import { useCollections } from "@/hooks/useCollections";
import { useAppContext } from "@/contexts/AppContext";
import { Collection } from "@/@types";
import { AddIcon, CollapseIcon } from "@/icons";
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


  return (
    <div className="p-4 bg-gray-900 h-[92vh] ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-base">Collections</h2>
        <button
          className="text-zinc-400 hover:text-zinc-100"
          onClick={toggleExpanded}
        >
          {expanded ? (
            <CollapseIcon className="transform transition-all duration-200 " />
          ) : (
            <ExpandIcon className="transform transition-all duration-200" />
          )}
        </button>
      </div>

      {/* Collections List */}
      {expanded && (
        <nav className="mt-4 space-y-2">
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
      )}
    </div>
  );
};

export default CollectionsList;
