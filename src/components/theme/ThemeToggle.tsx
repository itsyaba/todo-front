import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.appearance === 'dark';

  return (
    <button 
      type="button"
      className="w-10 h-10 p-0 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
      onClick={() => toggleTheme()}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}

export default ThemeToggle;