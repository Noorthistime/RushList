"use client";

// ============================================================
// Edit List dialog
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Loader2, Save } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { THEME_COLORS } from "@/lib/constants";
import { ThemeColor, TodoList } from "@/types";

const EXISTING_COLORS: ThemeColor[] = ["blue", "purple", "green", "red", "pink", "cyan"];
const ACCENT_COLORS: ThemeColor[] = ["rose_pink", "warmer_orange", "nothing_red", "ethereal_blue", "emerald_green", "contrast_grey"];

interface EditListDialogProps {
  list: TodoList;
  onUpdateList: (id: string, updates: { title?: string; theme?: ThemeColor }) => Promise<{ success: boolean }>;
}

export function EditListDialog({ list, onUpdateList }: EditListDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [theme, setTheme] = useState<ThemeColor>(list.theme);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const result = await onUpdateList(list.id, { title: title.trim(), theme });
    setLoading(false);

    if (result.success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted/50"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      } />
      <DialogContent className="backdrop-blur-xl bg-card/95 border-border/50 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-list-title">List Name</Label>
            <Input
              id="edit-list-title"
              placeholder="Enter list name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-background/50"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Accent Colors</Label>
              <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-2 min-[380px]:gap-3">
                {ACCENT_COLORS.map((color) => (
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

            <div className="space-y-3 pt-2">
              <Label>More Colors</Label>
              <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-2 min-[380px]:gap-3">
                {EXISTING_COLORS.map((color) => (
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
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/30 backdrop-blur-xs">
            <div className="space-y-0.5 max-w-[80%]">
              <Label htmlFor="match-accent-toggle" className="text-sm font-medium cursor-pointer">
                Match Accent Theme
              </Label>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Automatically match this list's color to the active website accent color
              </p>
            </div>
            <Checkbox
              id="match-accent-toggle"
              checked={theme === "match_accent"}
              onCheckedChange={(checked) => {
                if (checked) {
                  setTheme("match_accent");
                } else {
                  setTheme(list.theme !== "match_accent" ? list.theme : "blue");
                }
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full h-11 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
