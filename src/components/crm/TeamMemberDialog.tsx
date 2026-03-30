"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { User, Role, UserStatus } from "@/lib/types";
import { User as UserIcon, Mail, ShieldCheck, Plus, Calendar, Activity } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface TeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user?: User;
}

const PRESET_ROLES = [
  { label: "Administrator (Full Access)", value: "admin" },
  { label: "Manager (Pipeline Oversight)", value: "manager" },
  { label: "Sales Rep (Deal Management)", value: "sales" },
];

export function TeamMemberDialog({ isOpen, onClose, onSave, user }: TeamMemberDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "sales",
    avatar: "",
    status: "active",
    startDate: "",
    lastDay: "",
  });

  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleName, setCustomRoleName] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(user);
      const isPreset = PRESET_ROLES.some(r => r.value === user.role);
      setIsCustomRole(!isPreset);
      setCustomRoleName(!isPreset ? user.role : "");
    } else {
      setFormData({
        name: "",
        email: "",
        role: "sales",
        avatar: `https://picsum.photos/seed/${Math.random()}/200`,
        status: "active",
        startDate: new Date().toISOString().split('T')[0],
        lastDay: "",
      });
      setIsCustomRole(false);
      setCustomRoleName("");
    }
  }, [user, isOpen]);

  const handleRoleChange = (val: string) => {
    if (val === "custom") {
      setIsCustomRole(true);
      setFormData({ ...formData, role: "" });
    } else {
      setIsCustomRole(false);
      setFormData({ ...formData, role: val });
    }
  };

  const handleSave = () => {
    const finalRole = isCustomRole ? customRoleName : formData.role;
    if (!formData.name || !formData.email || !finalRole) return;
    
    onSave({
      ...formData as User,
      role: finalRole as Role,
      id: formData.id || Math.random().toString(36).substr(2, 9),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-accent" />
            {user ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
          <DialogDescription>
            Configure profile, lifecycle, and permissions for your team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className={cn("w-4 h-4", formData.status === 'active' ? "text-green-500" : "text-muted-foreground")} />
              <div>
                <Label className="text-sm font-bold">Account Status</Label>
                <p className="text-[10px] text-muted-foreground uppercase">{formData.status === 'active' ? 'Member is Active' : 'Member is Inactive'}</p>
              </div>
            </div>
            <Switch 
              checked={formData.status === 'active'} 
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="name" 
                className="pl-9"
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Robert Fox"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email"
                className="pl-9"
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="robert@forgecrm.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-9 text-xs"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Day</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-9 text-xs"
                  value={formData.lastDay}
                  onChange={(e) => setFormData({ ...formData, lastDay: e.target.value })}
                  disabled={formData.status === 'active'}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Organizational Role</Label>
            {!isCustomRole ? (
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <SelectValue placeholder="Select a role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {PRESET_ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-accent font-bold">
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3" />
                      Add New Role...
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter custom role name..." 
                    value={customRoleName}
                    onChange={(e) => setCustomRoleName(e.target.value)}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={() => setIsCustomRole(false)} className="text-xs">Cancel</Button>
                </div>
                <p className="text-[10px] text-accent font-bold uppercase">Defining new custom role</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-bold">Cancel</Button>
          <Button className="bg-accent hover:bg-accent/90 font-bold" onClick={handleSave}>
            {user ? "Update Profile" : "Invite to Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
