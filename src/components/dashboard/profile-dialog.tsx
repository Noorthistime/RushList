"use client";

import { useState } from "react";
import { User, Key } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthUser } from "@/types";

interface ProfileDialogProps {
  user: AuthUser;
}

export function ProfileDialog({ user }: ProfileDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
          <User className="w-5 h-5" />
        </Button>
      } />
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>User ID</Label>
            <Input value={user.id} readOnly className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={user.name} readOnly className="bg-muted" />
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
