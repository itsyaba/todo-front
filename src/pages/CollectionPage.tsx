import React, { useEffect } from "react";
import { useParams } from "wouter";
import { useCollections } from "@/hooks/useCollections";
import TasksList from "@/components/tasks/TasksList";
import { useAppContext } from "@/contexts/AppContext";
import { AddIcon, CollectionIcons, FavoriteIcon } from "@/icons";
import { SearchIcon } from "lucide-react";

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const collectionId =id;
  const { collections, updateCollection } = useCollections();
  // const { createTask } = useTasks(id);
  const { openModal, setActiveCollection } = useAppContext();
  // const { toast } = useToast();
  // const [taskTitle, setTaskTitle] = useState("");

  const collection = collections.find(c => c._id === collectionId);

  
  useEffect(() => {
    if (collection) {
      setActiveCollection(collection);
    }
    
    return () => {
      setActiveCollection(null);
    };
  }, [collection, setActiveCollection]);

  // const handleTaskInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && taskTitle.trim() && collectionId) {
  //     createTask({
  //       title: taskTitle.trim(),
  //       priority: "medium",
  //       collectionId: collectionId,
  //       completed: false
  //     });
  //     setTaskTitle("");
  //   }
  // };

  // const handleAddTask = () => {
  //   if (taskTitle.trim() && collectionId) {
  //     createTask({
  //       title: taskTitle.trim(),
  //       priority: "medium",
  //       collectionId: collectionId,
  //       completed: false
  //     });
  //     setTaskTitle("");
  //   } else {
  //     toast({
  //       title: "Task title is required",
  //       description: "Please enter a title for your task.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  console.log(collectionId);
  

  const toggleFavorite = () => {
    if (collection) {
      updateCollection( collection._id);
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
    <div className="p-4 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100">
      {/* Collection Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <span className="mr-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2">
              {CollectionIcons[collection.icon]}
            </span>
            {collection.name}
            <button
              className="ml-2 text-zinc-400 hover:text-amber-500"
              onClick={toggleFavorite}
            >
              <FavoriteIcon
                filled={
                  collection.isFavorite === null ? false : collection.isFavorite
                }
              />
            </button>
          </h1>
        </div>
        <div className="flex items-center">
          <button className="bg-zinc-800 p-1 rounded-full">
            <SearchIcon className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div
        className="mb-6 shadow-md shadow-gray-800 cursor-pointer py-4 px-3 rounded-md flex items-center justify-start gap-3"
        onClick={() => openModal("createTask")}
        aria-label="Add task"
      >
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
          <AddIcon className="text-sm" />
        </div>
        <div className="">
          Add New Task
        </div>
      </div>

      {/* Tasks List */}
      <TasksList collectionId={collectionId} />
    </div>
  );
};

export default CollectionPage;
