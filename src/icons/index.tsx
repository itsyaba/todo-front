/* eslint-disable react-refresh/only-export-components */
import React from "react";
import {
  Palette,
  User,
  GraduationCap,
  ShoppingCart,
  Home,
  Briefcase,
  Dumbbell,
  Heart,
  Umbrella,
  PawPrint,
  Utensils,
  Car,
  Clapperboard,
  Plane,
  Music,
  Gamepad2,
  ArrowDown,
  Minus,
  ArrowUp,
  ListChecks,
  Plus,
  Pen,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ChevronRight,
  Clock,
  Menu,
} from "lucide-react";
type IconProps = {
  className?: string;
  filled?: boolean;
};

export const CollectionIcons: Record<string, React.ReactNode> = {
  palette: <Palette className="h-5 w-5" />,
  person: <User className="h-5 w-5" />,
  school: <GraduationCap className="h-5 w-5" />,
  shopping_cart: <ShoppingCart className="h-5 w-5" />,
  home: <Home className="h-5 w-5" />,
  work: <Briefcase className="h-5 w-5" />,
  fitness_center: <Dumbbell className="h-5 w-5" />,
  favorite: <Heart className="h-5 w-5" />,
  beach_access: <Umbrella className="h-5 w-5" />,
  pets: <PawPrint className="h-5 w-5" />,
  local_dining: <Utensils className="h-5 w-5" />,
  directions_car: <Car className="h-5 w-5" />,
  local_movies: <Clapperboard className="h-5 w-5" />,
  flight: <Plane className="h-5 w-5" />,
  music_note: <Music className="h-5 w-5" />,
  sports_esports: <Gamepad2 className="h-5 w-5" />,
};

export const PriorityIcons: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  low: {
    icon: <ArrowDown className="h-5 w-5 text-green-500" />,
    color: "text-green-500",
  },
  medium: {
    icon: <Minus className="h-5 w-5 text-amber-500" />,
    color: "text-amber-500",
  },
  high: {
    icon: <ArrowUp className="h-5 w-5 text-red-500" />,
    color: "text-red-500",
  },
};

export const LogoIcon = ({ className }: IconProps) => (
  <ListChecks className={`text-amber-500 ${className || ""}`} />
);

export const AddIcon = ({ className }: IconProps) => (
  <Plus className={className} />
);

export const EditIcon = ({ className }: IconProps) => (
  <Pen className={className} />
);

export const DeleteIcon = ({ className }: IconProps) => (
  <Trash2 className={className} />
);

export const ExpandIcon = ({ className }: IconProps) => (
  <ChevronDown className={className} />
);

export const CollapseIcon = ({ className }: IconProps) => (
  <ChevronUp className={className} />
);

export const CloseIcon = ({ className }: IconProps) => (
  <X className={className} />
);

export const FavoriteIcon = ({
  className,
  filled = false,
}: IconProps & { filled?: boolean }) => (
  <Heart
    className={className}
    strokeWidth={1.5}
    fill={filled ? "currentColor" : "none"}
  />
);

export const SearchIcon = ({ className }: IconProps) => (
  <Search className={className} />
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <ChevronRight className={className} />
);

export const TimeIcon = ({ className }: IconProps) => (
  <Clock className={className} />
);

export const UserIcon = ({ className }: IconProps) => (
  <User className={className} />
);

export const MenuIcon = ({ className }: IconProps) => (
  <Menu className={className} />
);
