"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLists } from "@/hooks/use-lists";
import { useTasks } from "@/hooks/use-tasks";
import { useReminders } from "@/hooks/use-reminders";
import { ListGrid } from "@/components/lists/list-grid";
import { TaskList } from "@/components/tasks/task-list";
import { FullPageLoader } from "@/components/shared/loading-spinner";
import { TodoList } from "@/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreateListDialog } from "@/components/lists/create-list-dialog";

export default function DashboardPage() {
  const { lists, loading, createList, updateList, deleteList, fetchLists } = useLists();
  const { loading: taskLoading, createTask, updateTask, deleteTask } = useTasks(fetchLists);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  
  // Initialize reminders
  useReminders(lists);

  // Update selected list reference when lists refresh
  const currentList = selectedList ? lists.find(l => l.id === selectedList.id) || null : null;

  if (loading) {
     return <FullPageLoader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between flex-col md:flex-row gap-4 md:items-end">
         <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}>
           <h1 className="text-3xl font-bold">Your Lists</h1>
           <p className="text-muted-foreground mt-1">Manage and track your tasks.</p>
         </motion.div>
         <CreateListDialog onCreateList={createList} />
      </div>

      <ListGrid
        lists={lists}
        onCreateList={createList}
        onUpdateList={updateList}
        onDeleteList={deleteList}
        onSelectList={setSelectedList}
      />

      <Sheet open={!!selectedList} onOpenChange={(val) => !val && setSelectedList(null)}>
        <SheetContent side="right" className="w-[100vw] sm:max-w-2xl bg-background/80 backdrop-blur-2xl border-l-border/50 p-6 shadow-2xl">
           {currentList && (
             <TaskList
                listId={currentList.id}
                theme={currentList.theme}
                tasks={currentList.tasks}
                onCreateTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
             />
           )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
