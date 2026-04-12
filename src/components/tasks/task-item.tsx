"use client";

import { useState } from "react";
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

  const reminderText = getReminderText();
  const isOverdue = reminderText === "Overdue" && !task.completed;

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
        {reminderText && (
          <span className={`text-xs flex items-center gap-1 mt-1 ${
            isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
          }`}>
            <Clock className="w-3 h-3" />
            {reminderText}
          </span>
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
