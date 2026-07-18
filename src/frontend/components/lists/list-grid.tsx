"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TodoList } from "@/types";
import { ListCard } from "./list-card";
import { EmptyState } from "../shared/empty-state";
import { ListPlus } from "lucide-react";
import { CreateListDialog } from "./create-list-dialog";

interface ListGridProps {
  lists: TodoList[];
  onCreateList: (title: string, theme: any) => Promise<{ success: boolean }>;
  onUpdateList: (id: string, updates: any) => Promise<{ success: boolean }>;
  onDeleteList: (id: string) => Promise<{ success: boolean }>;
  onSelectList: (list: TodoList) => void;
}

export function ListGrid({ lists, onCreateList, onUpdateList, onDeleteList, onSelectList }: ListGridProps) {
  if (lists.length === 0) {
    return (
      <EmptyState
        icon={<ListPlus className="w-10 h-10" />}
        title="No lists yet"
        description="Create your first list to start organizing your tasks."
        action={<CreateListDialog onCreateList={onCreateList} />}
      />
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {lists.map((list) => (
          <motion.div
            key={list.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <ListCard
              list={list}
              onUpdate={onUpdateList}
              onDelete={onDeleteList}
              onClick={() => onSelectList(list)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
