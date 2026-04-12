"use client";

// ============================================================
// List Card component
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { MoreVertical, Trash2, ListTodo, ChevronRight } from "lucide-react";
import { TodoList } from "@/types";
import { THEME_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditListDialog } from "./edit-list-dialog";

interface ListCardProps {
  list: TodoList;
  onUpdate: (id: string, updates: any) => Promise<{ success: boolean }>;
  onDelete: (id: string) => Promise<{ success: boolean }>;
  onClick: () => void;
}

export function ListCard({ list, onUpdate, onDelete, onClick }: ListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = THEME_COLORS[list.theme];
  
  const totalTasks = list.tasks.length;
  const completedTasks = list.tasks.filter((t) => t.completed).length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(list.id);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ background: theme.bg }}
      />
      
      <div 
        className="relative h-full backdrop-blur-xl bg-card/60 rounded-2xl p-6 transition-all duration-300"
        style={{
          border: `1px solid ${theme.border}`,
          boxShadow: `0 4px 20px -2px rgba(0,0,0,0.1), inset 0 0 0 1px ${theme.border}`,
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: theme.bg, color: theme.accent }}
          >
            <ListTodo className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <EditListDialog list={list} onUpdateList={onUpdate} />
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/50">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-1 truncate text-foreground group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300"
            style={{ backgroundImage: `linear-gradient(to right, ${theme.text}, ${theme.accent})` }}
        >
          {list.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          Created {format(new Date(list.createdAt), "MMM d, yyyy")}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span style={{ color: theme.text }} className="font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: theme.accent, boxShadow: theme.glow }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between items-center pt-4 text-sm text-muted-foreground">
            <span>{completedTasks} / {totalTasks} tasks</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
