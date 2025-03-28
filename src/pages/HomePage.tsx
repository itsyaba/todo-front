import React, { useState } from "react";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/api";
import { Collection } from "@/@types";
import { AddIcon, CollectionIcons } from "@/icons";
import { useAppContext } from "@/contexts/AppContext";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CollectionCard = ({ collection, onClick }: { collection: Collection, onClick: () => void }) => {
  const { data: tasks = [] } = useQuery({
    queryKey: ["/task", collection.id],
    queryFn: () => getTasks(collection.id),
  });
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  

  return (
    <div 
      className="bg-white shadow-md  dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center mb-2 flex-row">
        <div className="text-3xl mr-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2">
          {CollectionIcons[collection.icon]}
        </div>
        <h2 className="text-lg font-medium">{collection.name}</h2>
      </div>
      <div className="text-sm text-zinc-400 mt-auto">
        {completedCount}/{totalCount} done
        {/* TODO : add the total count of tasks */}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { collections, isLoading } = useCollections();
  const { openModal } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [, setLocation] = useLocation();

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
    ? collections.filter(c => c.isFavorite)
    : collections;

  return (
    <div className="p-8 max-w-5xl mx-auto text-black dark:text-white">
      <h1 className="text-2xl font-semibold mb-6">Collections</h1>
      
      {/* Filter tabs */}
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={(value) => setFilter(value as 'all' | 'favorites')}
        className="mb-6"
      >
        <TabsList className="border-b border-zinc-800 bg-transparent h-auto p-0 w-full justify-start rounded-none">
          <TabsTrigger 
            value="all"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-4 py-2"
          >
            All collections
          </TabsTrigger>
          <TabsTrigger 
            value="favorites"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-4 py-2"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map(collection => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                onClick={() => setLocation(`/collections/${collection._id}`)}
              />
            ))}
            
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
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map(collection => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                onClick={() => setLocation(`/collections/${collection._id}`)}
              />
            ))}
            
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
        </TabsContent>
      </Tabs>
      
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
