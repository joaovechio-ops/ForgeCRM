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
import { Lead, LeadStatus, User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { User as UserIcon, Mail, Building, Globe, Zap, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  lead?: Lead;
}

export function LeadDialog({ isOpen, onClose, onSave, lead }: LeadDialogProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: "",
    email: "",
    company: "",
    status: "New",
    origin: "Direct",
    aiScore: 50,
    assignedTo: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        name: "",
        email: "",
        company: "",
        status: "New",
        origin: "Direct",
        aiScore: 50,
        assignedTo: MOCK_USERS[0]?.id || "",
        createdAt: new Date().toISOString(),
      });
    }
  }, [lead, isOpen]);

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.company) return;
    
    onSave({
      ...formData as Lead,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      lastInteraction: formData.lastInteraction || new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-accent" />
            {lead ? "Edit Lead Details" : "Capture New Lead"}
          </DialogTitle>
          <DialogDescription>
            Enter the prospect's details to initiate the sales lifecycle and calculate conversion probability.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Robert Fox"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="robert@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-xs font-bold uppercase text-muted-foreground">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="company" 
                className="pl-9"
                value={formData.company} 
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Lead Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val: LeadStatus) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New Prospect</SelectItem>
                  <SelectItem value="Contacted">Initial Contact</SelectItem>
                  <SelectItem value="Qualified">Sales Qualified</SelectItem>
                  <SelectItem value="Unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Lead Source / Origin</Label>
              <Select 
                value={formData.origin} 
                onValueChange={(val) => setFormData({ ...formData, origin: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn Outreach</SelectItem>
                  <SelectItem value="Referral">Partner Referral</SelectItem>
                  <SelectItem value="Direct">Direct Contact</SelectItem>
                  <SelectItem value="Website">Inbound Website</SelectItem>
                  <SelectItem value="Event">Industry Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Assigned Owner</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.filter(u => u.status === 'active').map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">AI Conversion Score</Label>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-accent hover:text-accent/80 transition-colors focus:outline-none">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px] p-4 shadow-xl border-accent/20 bg-card text-card-foreground">
                      <p className="font-bold mb-2 text-sm text-primary">Calculation Factors</p>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <span className="font-bold text-accent uppercase text-[10px]">Engagement (40%):</span>
                          <span className="block text-muted-foreground">Depth of recent interactions.</span>
                        </li>
                        <li>
                          <span className="font-bold text-accent uppercase text-[10px]">Fit (30%):</span>
                          <span className="block text-muted-foreground">Company size/industry alignment.</span>
                        </li>
                        <li>
                          <span className="font-bold text-accent uppercase text-[10px]">Source (20%):</span>
                          <span className="block text-muted-foreground">Origin conversion history.</span>
                        </li>
                        <li>
                          <span className="font-bold text-accent uppercase text-[10px]">Tone (10%):</span>
                          <span className="block text-muted-foreground">Communication sentiment.</span>
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.aiScore} 
                  onChange={e => setFormData({ ...formData, aiScore: Number(e.target.value) })}
                  className="font-bold text-accent"
                />
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="font-bold">Discard</Button>
          <Button className="bg-accent hover:bg-accent/90 font-bold px-8" onClick={handleSave}>
            {lead ? "Update Record" : "Capture Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
