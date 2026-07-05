"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Loader2, Save, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/types";
import { format } from "date-fns";

const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  const startDay = date.getDay();
  
  const prevMonthDate = new Date(year, month, 0);
  const prevMonthDaysCount = prevMonthDate.getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDaysCount - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }
  
  const currentMonthDaysCount = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= currentMonthDaysCount; i++) {
    days.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
    });
  }
  
  const totalCells = 42;
  const remainingCells = totalCells - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }
  
  return days;
};

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
  let initialDateObj: Date | null = null;
  let initialHours = "12";
  let initialMinutes = "00";
  let initialSeconds = "00";
  
  if (task.reminderTime) {
    const d = new Date(task.reminderTime);
    initialDate = d.toISOString().split("T")[0];
    initialDateObj = d;
    const parts = d.toTimeString().split(" ")[0].split(":");
    initialHours = parts[0] || "12";
    initialMinutes = parts[1] || "00";
    initialSeconds = parts[2] || "00";
  }

  const [currentDate, setCurrentDate] = useState(initialDateObj || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDateObj);
  const [reminderDate, setReminderDate] = useState(initialDate);
  
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  
  const [loading, setLoading] = useState(false);

  // Sync state if task changes
  useEffect(() => {
    setTitle(task.title);
    if (task.reminderTime) {
      const d = new Date(task.reminderTime);
      setReminderDate(d.toISOString().split("T")[0]);
      setSelectedDate(d);
      setCurrentDate(d);
      const parts = d.toTimeString().split(" ")[0].split(":");
      setHours(parts[0] || "12");
      setMinutes(parts[1] || "00");
      setSeconds(parts[2] || "00");
    } else {
      setReminderDate("");
      setSelectedDate(null);
      setHours("12");
      setMinutes("00");
      setSeconds("00");
    }
  }, [task]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    let reminderIso = null;
    if (reminderDate) {
       const hh = hours.padStart(2, "0") || "12";
       const mm = minutes.padStart(2, "0") || "00";
       const ss = seconds.padStart(2, "0") || "00";
       reminderIso = new Date(`${reminderDate}T${hh}:${mm}:${ss}`).toISOString();
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
            <div className="flex flex-col gap-3">
              {/* Custom Calendar Picker Row */}
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger render={
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-11 bg-background/50 border-border/50 justify-start font-normal text-muted-foreground hover:bg-background/80 hover:text-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4 shrink-0" />
                      {selectedDate ? format(selectedDate, "PPP") : <span className="text-muted-foreground/60">Pick a date</span>}
                    </Button>
                  } />
                  <PopoverContent className="w-[304px] p-0 bg-card/98 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold">
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((item, index) => {
                          const isSelected = selectedDate &&
                            selectedDate.getDate() === item.day &&
                            selectedDate.getMonth() === item.month &&
                            selectedDate.getFullYear() === item.year;
                            
                          const isToday = new Date().getDate() === item.day &&
                            new Date().getMonth() === item.month &&
                            new Date().getFullYear() === item.year;
                            
                          const isPast = new Date(item.year, item.month, item.day) < new Date(new Date().setHours(0,0,0,0));

                          return (
                            <button
                              key={index}
                              type="button"
                              disabled={isPast}
                              onClick={() => {
                                const dateObj = new Date(item.year, item.month, item.day);
                                setSelectedDate(dateObj);
                                setReminderDate(format(dateObj, "yyyy-MM-dd"));
                              }}
                              className={`h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all ${
                                isSelected
                                  ? "text-white font-bold"
                                  : isToday
                                  ? "border border-rose-500/50 text-foreground"
                                  : item.isCurrentMonth
                                  ? "text-foreground hover:bg-muted/50"
                                  : "text-muted-foreground/30 hover:bg-muted/20"
                              }`}
                              style={isSelected ? { backgroundColor: themeColor } : {}}
                            >
                              {item.day}
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(null);
                            setReminderDate("");
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            setSelectedDate(today);
                            setReminderDate(format(today, "yyyy-MM-dd"));
                            setCurrentDate(today);
                          }}
                          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom HH:MM:SS Picker Row */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/30 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Set Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={hours}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = 0;
                      if (val > 23) val = 23;
                      setHours(val.toString().padStart(2, "0"));
                    }}
                    className="w-14 h-9 p-1 text-center bg-background/50 font-mono text-sm border-border/50 rounded-lg focus:border-rose-500/50"
                    placeholder="HH"
                  />
                  <span className="text-muted-foreground text-xs font-bold">:</span>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = 0;
                      if (val > 59) val = 59;
                      setMinutes(val.toString().padStart(2, "0"));
                    }}
                    className="w-14 h-9 p-1 text-center bg-background/50 font-mono text-sm border-border/50 rounded-lg focus:border-rose-500/50"
                    placeholder="MM"
                  />
                  <span className="text-muted-foreground text-xs font-bold">:</span>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={seconds}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = 0;
                      if (val > 59) val = 59;
                      setSeconds(val.toString().padStart(2, "0"));
                    }}
                    className="w-14 h-9 p-1 text-center bg-background/50 font-mono text-sm border-border/50 rounded-lg focus:border-rose-500/50"
                    placeholder="SS"
                  />
                </div>
              </div>
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
