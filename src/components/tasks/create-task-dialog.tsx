"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateTaskDialogProps {
  listId: string;
  onCreateTask: (listId: string, title: string, reminderTime?: string | null) => Promise<{ success: boolean }>;
  themeColor: string;
}

export function CreateTaskDialog({ listId, onCreateTask, themeColor }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    let reminderIso = null;
    if (reminderDate && reminderTime) {
       reminderIso = new Date(`${reminderDate}T${reminderTime}`).toISOString();
    }

    const result = await onCreateTask(listId, title.trim(), reminderIso);
    setLoading(false);

    if (result.success) {
      setTitle("");
      setReminderDate("");
      setReminderTime("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button
          style={{ backgroundColor: themeColor }}
          className="text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      } />
      <DialogContent className="backdrop-blur-xl bg-card/95 border-border/50 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
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
                min={new Date().toISOString().split("T")[0]}
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
