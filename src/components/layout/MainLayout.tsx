import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import CollectionsList from "../collections/CollectionsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuIcon } from "@/icons";
import { useAppContext } from "@/contexts/AppContext";
import TaskContextMenu from "../tasks/TaskContextMenu";
import CreateTaskModal from "../tasks/CreateTaskModal";
import CreateCollectionModal from "../collections/CreateCollectionModal";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeModal, contextMenuPosition, contextMenuTask } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

      console.log("context menu task ID : ", contextMenuTask);


  return (
    <div className="min-h-screen flex flex-col bg-gray-200 dark:bg-background dark:text-zinc-100">
      <Header />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 border-r dark:border-zinc-800 overflow-y-auto scrollbar-hide transition-transform duration-200 absolute md:relative z-10 md:translate-x-0 h-full bg-background`}
        >
          <CollectionsList />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative">
          {isMobile && (
            <button 
              className="fixed top-16 left-4 z-10 bg-zinc-800 p-2 rounded-full"
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </button>
          )}
          {children}
        </main>
      </div>
      
      {/* Context Menu */}
      {contextMenuPosition && <TaskContextMenu />}
      
      {activeModal === "createTask" && <CreateTaskModal parentId={contextMenuTask?.id} />}
      {activeModal === "editTask" && <CreateTaskModal isEditing parentId={""} />}
      {activeModal === "createCollection" && <CreateCollectionModal />}
      {activeModal === "editCollection" && <CreateCollectionModal isEditing />}
      {activeModal === "createSubTask" && <CreateTaskModal parentId={""} isSubtask/>}
    </div>
  );
};

export default MainLayout;
