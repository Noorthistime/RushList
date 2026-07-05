"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { GripVertical, Trash2, Pencil, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format, isPast, isToday, isTomorrow } from "date-fns";

interface TaskItemProps {
  task: Task;
  themeColor: string;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, themeColor, onToggle, onDelete, onEdit }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!task.reminderTime) return;
    
    // Update every second to tick the progress and time remaining smoothly
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [task.reminderTime]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const getReminderText = () => {
    if (!task.reminderTime) return null;
    const date = new Date(task.reminderTime);
    if (isPast(date)) return "Overdue";
    if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, "h:mm a")}`;
    return format(date, "MMM d, h:mm a");
  };

  const getProgress = () => {
    if (task.completed) return 100;
    if (!task.reminderTime || !task.createdAt) return 0;
    
    const start = new Date(task.createdAt).getTime();
    const end = new Date(task.reminderTime).getTime();
    const current = now.getTime();
    
    if (current >= end) return 100;
    if (current <= start) return 0;
    
    const total = end - start;
    const elapsed = current - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getTimeRemainingText = () => {
    if (task.completed) return "Completed";
    if (!task.reminderTime) return "";
    
    const end = new Date(task.reminderTime).getTime();
    const current = now.getTime();
    const diff = end - current;
    
    if (diff <= 0) return "Time's Up!";
    
    const secs = Math.floor(diff / 1000) % 60;
    const mins = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (days === 0 && hours === 0) {
      parts.push(`${secs}s`);
    }
    
    return parts.join(" ") + " left";
  };

  const reminderText = getReminderText();
  const progress = getProgress();
  const timeRemaining = getTimeRemainingText();
  const isTimeUp = progress >= 100 && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      style={style}
      className={`group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:bg-card/80 ${
        isDragging ? "shadow-xl border-primary" : "hover:border-border"
      }`}
    >
      <div 
        ref={setNodeRef} 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="relative flex items-center">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id, task.completed)}
          className="w-5 h-5 rounded-md border-2 data-[state=checked]:text-white transition-all duration-300"
          style={{ 
            borderColor: task.completed ? themeColor : 'currentColor',
            backgroundColor: task.completed ? themeColor : 'transparent'
          }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <span 
          className={`truncate font-medium transition-all duration-300 ${
            task.completed ? "line-through text-muted-foreground opacity-70" : "text-foreground"
          }`}
        >
          {task.title}
        </span>
        
        {task.reminderTime && (
          <div className="mt-2 space-y-1.5 w-full">
            <div className="flex justify-between items-center text-[10px]">
              <span className={`flex items-center gap-1 ${
                isTimeUp ? "text-destructive font-semibold animate-pulse" : "text-muted-foreground"
              }`}>
                <Clock className="w-3 h-3" />
                {reminderText}
              </span>
              <span className={`font-semibold ${isTimeUp ? "text-destructive" : ""}`} style={!isTimeUp && !task.completed ? { color: themeColor } : {}}>
                {task.completed ? "Completed" : isTimeUp ? "Time's Up!" : `${Math.round(progress)}% (${timeRemaining})`}
              </span>
            </div>
            <div className="relative w-full h-1 bg-muted/20 border border-border/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: task.completed 
                    ? "var(--color-green-500, #22c55e)" 
                    : isTimeUp 
                    ? "var(--color-destructive, #ef4444)" 
                    : `linear-gradient(90deg, ${themeColor}, var(--color-pink-500, #ec4899))`,
                  boxShadow: task.completed
                    ? "none"
                    : isTimeUp 
                    ? "0 0 6px rgba(239, 68, 68, 0.4)" 
                    : `0 0 6px color-mix(in srgb, ${themeColor} 40%, transparent)`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50" onClick={() => onEdit(task)}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(task.id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
