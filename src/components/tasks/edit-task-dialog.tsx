"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Loader2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/types";

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<{ success: boolean }>;
  themeColor: string;
}

export function EditTaskDialog({ task, isOpen, onClose, onUpdate, themeColor }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  
  // Parse existing date/time if present
  let initialDate = "";
  let initialTime = "";
  if (task.reminderTime) {
    const d = new Date(task.reminderTime);
    initialDate = d.toISOString().split("T")[0];
    initialTime = d.toTimeString().split(" ")[0].slice(0, 5);
  }

  const [reminderDate, setReminderDate] = useState(initialDate);
  const [reminderTime, setReminderTime] = useState(initialTime);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    let reminderIso = null;
    if (reminderDate && reminderTime) {
       reminderIso = new Date(`${reminderDate}T${reminderTime}`).toISOString();
    } else if (!reminderDate && !reminderTime) {
       // user cleared it
       reminderIso = null;
    } else {
       // partially filled, retain old or keep null (simplified here to null if not both)
       reminderIso = null; 
    }

    const result = await onUpdate(task.id, { title: title.trim(), reminderTime: reminderIso });
    setLoading(false);

    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="backdrop-blur-xl bg-card/95 border-border/50 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task-title">Task Title</Label>
            <Input
              id="edit-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Reminder (Optional)</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="bg-background/50 flex-1"
              />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-background/50 flex-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !title.trim()}
            style={{ backgroundColor: themeColor }}
            className="w-full text-white mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
