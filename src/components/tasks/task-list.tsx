"use client";

import { useState, useEffect } from "react";
import { Task, ThemeColor } from "@/types";
import { THEME_COLORS } from "@/lib/constants";
import { TaskItem } from "./task-item";
import { CreateTaskDialog } from "./create-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { EmptyState } from "../shared/empty-state";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskListProps {
  listId: string;
  theme: ThemeColor;
  tasks: Task[];
  onCreateTask: (listId: string, title: string, reminderTime?: string | null) => Promise<{ success: boolean }>;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<{ success: boolean }>;
  onDeleteTask: (id: string) => Promise<{ success: boolean }>;
}

export function TaskList({ listId, theme, tasks, onCreateTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  const themeData = THEME_COLORS[theme];
  const [localTasks, setLocalTasks] = useState(tasks.sort((a,b) => a.order - b.order));
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync when prop changes
  useEffect(() => {
     setLocalTasks(tasks.sort((a,b) => a.order - b.order));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localTasks.findIndex((t) => t.id === active.id);
      const newIndex = localTasks.findIndex((t) => t.id === over.id);
      
      const newTasks = arrayMove(localTasks, oldIndex, newIndex);
      setLocalTasks(newTasks);
      
      // Update order in backend
      // In a real app we might batch update order or just update the moved task
      await onUpdateTask(active.id as string, { order: newIndex });
    }
  };

  const pendingTasks = localTasks.filter(t => !t.completed);
  const completedTasks = localTasks.filter(t => t.completed);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${themeData.text}, ${themeData.accent})` }}>
           Tasks
        </h2>
        <CreateTaskDialog listId={listId} onCreateTask={onCreateTask} themeColor={themeData.accent} />
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4 h-[500px]">
        {localTasks.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-10 h-10" />}
            title="All caught up!"
            description="You don't have any tasks in this list yet."
          />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {pendingTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Pending ({pendingTasks.length})</h3>
                  <SortableContext items={pendingTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {pendingTasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            themeColor={themeData.accent}
                            onToggle={(id, val) => {
                               setLocalTasks(localTasks.map(t => t.id === id ? {...t, completed: !val} : t));
                               onUpdateTask(id, { completed: !val });
                            }}
                            onDelete={(id) => {
                               setLocalTasks(localTasks.filter(t => t.id !== id));
                               onDeleteTask(id);
                            }}
                            onEdit={setEditingTask}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Completed ({completedTasks.length})</h3>
                  <div className="space-y-2 opacity-60">
                    <AnimatePresence>
                      {completedTasks.map(task => (
                        <TaskItem 
                          key={task.id} 
                          task={task} 
                          themeColor={themeData.accent}
                          onToggle={(id, val) => {
                             setLocalTasks(localTasks.map(t => t.id === id ? {...t, completed: !val} : t));
                             onUpdateTask(id, { completed: !val });
                          }}
                          onDelete={(id) => {
                             setLocalTasks(localTasks.filter(t => t.id !== id));
                             onDeleteTask(id);
                          }}
                          onEdit={setEditingTask}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </DndContext>
        )}
      </ScrollArea>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onUpdate={async (id, updates) => {
             const res = await onUpdateTask(id, updates);
             if (res.success) {
               setLocalTasks(localTasks.map(t => t.id === id ? {...t, ...updates} : t));
             }
             return res;
          }}
          themeColor={themeData.accent}
        />
      )}
    </div>
  );
}
