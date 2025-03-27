import React from "react";
import { CollectionIcons, FavoriteIcon } from "@/icons";
import { useCollections } from "@/hooks/useCollections";
import { useLocation } from "wouter";
import { Collection } from "@/@types";

interface CollectionItemProps {
  collection: Collection;
  onClick: () => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ collection, onClick }) => {
  const { updateCollection } = useCollections();
  const [location] = useLocation();
  const isActive = location === `/collections/${collection.id}`;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCollection({ 
      id: collection.id, 
      collection: { favorite: !collection.favorite } 
    });
  };

  return (
    <div
      className={`w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-zinc-800 cursor-pointer ${
        isActive ? "bg-zinc-800/30 text-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${isActive ? "text-primary" : "text-zinc-400"}`}>
          {CollectionIcons[collection.icon]}
        </span>
        <span className={isActive ? "font-medium" : ""}>{collection.name}</span>
      </div>
      
      <div
        onClick={toggleFavorite}
        className="text-zinc-400 hover:text-amber-500 cursor-pointer"
      >
        <FavoriteIcon filled={collection.favorite === null ? false : collection.favorite} />
      </div>
    </div>
  );
};

export default CollectionItem;
