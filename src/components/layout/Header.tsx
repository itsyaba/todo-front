import type React from "react";
import { LogoIcon, AddIcon } from "@/icons";
import { useLocation } from "wouter";
import { useAppContext } from "@/contexts/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useModalStore } from "@/store/useModalStore";
import AuthModal from "../AuthModal";
import { User2Icon } from "lucide-react";
import { ModeToggle } from "../theme/mode-toggle";
const Header: React.FC = () => {
  const { openModal } = useAppContext();
  const { isLoggedIn, account, logout } = useAuth()
    const { setCurrentModal } = useModalStore()
    const [, setPopover] = useState(false)

    
    const closePopover = () => {
      setPopover(false)
    }
  
    const clickLogin = () => {
      setCurrentModal('LOGIN')
      closePopover()
    }
  
    const clickRegister = () => {
      setCurrentModal('REGISTER')
      closePopover()
    }
  const [, setLocation] = useLocation();

  return (
    <header className="bg-gray-300 dark:bg-background border-b border-border py-2 px-4 flex justify-between items-center">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setLocation("/")}
      >
        <LogoIcon className="text-xl" />
        <h1 className="font-semibold text-lg">TODO</h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="bg-pink-600 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => openModal("createTask")}
          aria-label="Add task"
        >
          <AddIcon className="text-sm" />
        </button>

        <AuthModal />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="h-9 w-9 cursor-pointer">
                {/* <AvatarImage alt={account?.username || "Guest"} /> */}
                <AvatarFallback>
                  {" "}
                  <User2Icon className="text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-center">
              Hello, {account?.username || "Guest"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {isLoggedIn ? (
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={clickLogin}
                  className="cursor-pointer"
                >
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clickRegister}
                  className="cursor-pointer"
                >
                  Register
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <ThemeToggle /> */}
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
