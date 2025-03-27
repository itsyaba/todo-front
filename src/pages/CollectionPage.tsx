import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useCollections } from "@/hooks/useCollections";
import { useTasks } from "@/hooks/useTasks";
import TasksList from "@/components/tasks/TasksList";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { CollectionIcons, FavoriteIcon } from "@/icons";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const collectionId = id ? parseInt(id) : undefined;
  const { collections, updateCollection } = useCollections();
  const { createTask } = useTasks(collectionId);
  const { openModal, setActiveCollection } = useAppContext();
  const { toast } = useToast();
  const [taskTitle, setTaskTitle] = useState("");

  const collection = collections.find(c => c.id === collectionId);

  useEffect(() => {
    if (collection) {
      setActiveCollection(collection);
    }
    
    return () => {
      setActiveCollection(null);
    };
  }, [collection, setActiveCollection]);

  const handleTaskInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskTitle.trim() && collectionId) {
      createTask({
        title: taskTitle.trim(),
        priority: "medium",
        collectionId: collectionId,
        completed: false
      });
      setTaskTitle("");
    }
  };

  const handleAddTask = () => {
    if (taskTitle.trim() && collectionId) {
      createTask({
        title: taskTitle.trim(),
        priority: "medium",
        collectionId: collectionId,
        completed: false
      });
      setTaskTitle("");
    } else {
      toast({
        title: "Task title is required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = () => {
    if (collection) {
      updateCollection({
        id: collection.id,
        collection: { favorite: !collection.favorite },
      });
    }
  };

  if (!collection) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <p className="text-zinc-400">Collection not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Collection Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <span className="mr-2 text-primary">{CollectionIcons[collection.icon]}</span>
            {collection.name}
            <button 
              className="ml-2 text-zinc-400 hover:text-amber-500"
              onClick={toggleFavorite}
            >
              <FavoriteIcon filled={collection.favorite === null ? false : collection.favorite} />
            </button>
          </h1>
        </div>
        <div className="flex items-center">
          <button className="bg-zinc-800 p-1 rounded-full">
            <SearchIcon className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="mb-6">
        <div className="border border-zinc-800 rounded-lg overflow-hidden mb-3">
          <Input
            type="text"
            placeholder="Add a task"
            className="w-full bg-background border-none focus:ring-primary py-3 px-4"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyUp={handleTaskInput}
          />
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-background border border-zinc-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue=""
          >
            <option value="" disabled>Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Input
            type="text"
            placeholder="Select date"
            className="bg-background border border-zinc-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            className="bg-primary text-white rounded-lg py-2 px-4 font-medium"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <TasksList collectionId={collectionId} />
    </div>
  );
};

export default CollectionPage;
