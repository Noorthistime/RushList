"use client";

// ============================================================
// Create List dialog
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { THEME_COLORS } from "@/lib/constants";
import { ThemeColor } from "@/types";

interface CreateListDialogProps {
  onCreateList: (title: string, theme: ThemeColor) => Promise<{ success: boolean }>;
}

export function CreateListDialog({ onCreateList }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<ThemeColor>("blue");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const result = await onCreateList(title.trim(), theme);
    setLoading(false);

    if (result.success) {
      setTitle("");
      setTheme("blue");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <DialogTrigger render={
          <Button
            id="create-list-btn"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New List
          </Button>
        } />
      </motion.div>
      <DialogContent className="backdrop-blur-xl bg-card/95 border-border/50 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="list-title">List Name</Label>
            <Input
              id="list-title"
              placeholder="Enter list name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-background/50"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Theme Color</Label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(color)}
                  className={`relative h-12 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                    theme === color
                      ? "ring-2 ring-offset-2 ring-offset-background"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: THEME_COLORS[color].bg,
                    borderColor: THEME_COLORS[color].border,
                    borderWidth: "1px",
                    boxShadow: theme === color ? THEME_COLORS[color].glow : "none",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: THEME_COLORS[color].accent }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {THEME_COLORS[color].name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {loading ? "Creating..." : "Create List"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
