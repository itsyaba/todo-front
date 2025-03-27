/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/api";
import { Collection } from "@/@types";
import { AddIcon, CollectionIcons } from "@/icons";
import { useAppContext } from "@/contexts/AppContext";

const CollectionCard = ({ collection, onClick }: { collection: Collection, onClick: () => void }) => {
  // Using useQuery directly for each collection
  const { data: tasks = [] } = useQuery({
    queryKey: ["/task", collection.id],
    queryFn: () => getTasks(collection.id),
  });
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  
  return (
    <div 
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="text-3xl mr-3">
          {CollectionIcons[collection.icon]}
        </div>
        <h2 className="text-lg font-medium">{collection.name}</h2>
      </div>
      <div className="text-sm text-zinc-400 mt-auto">
        {completedCount}/{totalCount} done
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { collections, isLoading } = useCollections();
  const { openModal } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Filter collections based on the selected filter
  const filteredCollections = filter === 'favorites' 
    ? collections.filter(c => c.favorite)
    : collections;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Collections</h1>
      
      {/* Filter tabs */}
      <div className="flex mb-6 border-b border-zinc-800">
        <button 
          className={`px-4 py-2 ${filter === 'all' ? 'border-b-2 border-primary text-primary' : 'text-zinc-400'}`}
          onClick={() => setFilter('all')}
        >
          All collections
        </button>
        <button 
          className={`px-4 py-2 ${filter === 'favorites' ? 'border-b-2 border-primary text-primary' : 'text-zinc-400'}`}
          onClick={() => setFilter('favorites')}
        >
          Favorites
        </button>
      </div>
      
      {/* Collections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {filteredCollections.map(collection => (
          <CollectionCard 
            key={collection.id} 
            collection={collection} 
            onClick={() => setLocation(`/collections/${collection.id}`)}
          />
        ))} */}
        
        {/* Add collection button */}
        <div 
          className="border border-dashed border-zinc-700 rounded-lg flex items-center justify-center h-[104px] cursor-pointer hover:bg-zinc-900/50 transition-colors"
          onClick={() => openModal("createCollection")}
        >
          <div className="flex flex-col items-center text-zinc-500">
            <AddIcon className="text-2xl mb-2" />
            <span>Add collection</span>
          </div>
        </div>
      </div>
      
      {collections.length === 0 && (
        <div className="text-center py-12 border border-zinc-800 rounded-lg mt-6">
          <p className="text-zinc-400 mb-4">You don't have any collections yet.</p>
          <p className="text-zinc-500">
            Create your first collection by clicking the "Add collection" button above.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
