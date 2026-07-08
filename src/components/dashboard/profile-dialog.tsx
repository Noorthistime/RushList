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
  children?: React.ReactElement;
}

export function ProfileDialog({ user, children }: ProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (currentPasswordInput !== user.password) {
      setError("Incorrect current password.");
      return;
    }
    if (!newPasswordInput) {
      setError("New password cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to change password.");
        setIsSaving(false);
        return;
      }

      // Update local state password to reflect change immediately
      user.password = newPasswordInput;
      setIsChangingPassword(false);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = "/auth";
      } else {
        setError(data.error || "Failed to delete account.");
        setIsDeleting(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setIsChangingPassword(false);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setDeleteConfirm(false);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={
        children || (
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
            <User className="w-5 h-5" />
          </Button>
        )
      } />
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isChangingPassword ? (
            <>
              <div className="space-y-1">
                <Label>Username</Label>
                <Input value={user.name} readOnly className="bg-muted" />
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
              
              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button onClick={() => setIsChangingPassword(true)} className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white">
                Change Password
              </Button>

              <div className="pt-2 border-t border-border/50">
                <Button 
                  onClick={handleDeleteAccount} 
                  disabled={isDeleting}
                  variant={deleteConfirm ? "destructive" : "ghost"}
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold transition-all duration-300"
                >
                  {isDeleting 
                    ? "Deleting..." 
                    : deleteConfirm 
                    ? "Are you sure? Click to Confirm" 
                    : "Delete Account"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPasswordInput}
                    onChange={(e) => {
                      setCurrentPasswordInput(e.target.value);
                      setError("");
                    }}
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPasswordInput}
                    onChange={(e) => {
                      setNewPasswordInput(e.target.value);
                      setError("");
                    }}
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => {
                  setIsChangingPassword(false);
                  setError("");
                }} className="flex-1" disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
