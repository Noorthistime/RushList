"use client";

import { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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
            <Input value={user.id} readOnly className="bg-muted font-mono text-xs" />
          </div>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={user.name} readOnly className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={user.email} readOnly className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={user.password || ""}
                readOnly
                className="bg-muted pr-10 font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
