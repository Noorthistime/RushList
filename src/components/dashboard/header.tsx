"use client";

// ============================================================
// Dashboard header with user info, theme toggle, logout
// ============================================================

import { motion } from "framer-motion";
import { Moon, Sun, LogOut, ListTodo, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AuthUser } from "@/types";
import { ProfileDialog } from "./profile-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAccent, ACCENT_OPTIONS } from "@/hooks/use-accent";

interface HeaderProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { accent, setAccent, mounted: accentMounted } = useAccent();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/70 border-b border-border/50 premium-header"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.12, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 cursor-pointer"
          >
            <ListTodo className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent hidden sm:block premium-logo-text">
            RushList
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                id="theme-toggle"
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl hover:bg-muted/50 premium-header-btn"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          )}

          {/* Accent toggle */}
          {mounted && accentMounted && (
            <DropdownMenu>
              <motion.div whileTap={{ scale: 0.9 }}>
                <DropdownMenuTrigger render={
                  <Button
                    id="accent-toggle"
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-muted/50 premium-header-btn"
                  >
                    <Palette className="w-5 h-5" />
                  </Button>
                } />
              </motion.div>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-1.5 shadow-2xl">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Select Accent Color
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                {ACCENT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setAccent(option.id)}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-sm font-medium flex-1">
                      {option.name}
                    </span>
                    {accent === option.id && (
                      <Check className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

           {/* User info */}
          {user && (
            <div className="flex items-center gap-3">

              <ProfileDialog user={user}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-rose-500/20 focus:outline-none premium-avatar-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.button>
              </ProfileDialog>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  id="logout-btn"
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive premium-header-btn"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
