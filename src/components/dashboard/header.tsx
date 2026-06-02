"use client";

// ============================================================
// Dashboard header with user info, theme toggle, logout
// ============================================================

import { motion } from "framer-motion";
import { Moon, Sun, LogOut, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AuthUser } from "@/types";
import { ProfileDialog } from "./profile-dialog";

interface HeaderProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/70 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <span className="font-bold text-white text-[10px]">SNM</span>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
            RushList-SNM
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
                className="rounded-xl hover:bg-muted/50"
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

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20"
              >
                {user.name.charAt(0).toUpperCase()}
              </motion.div>

              <ProfileDialog user={user} />

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  id="logout-btn"
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
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
