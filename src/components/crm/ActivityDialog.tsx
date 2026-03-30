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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Activity, MOCK_USERS, MOCK_LEADS, MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import { Phone, Mail, Calendar, MessageSquare, Clock, User as UserIcon, Briefcase } from "lucide-react";

interface ActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: any) => void;
  activity?: any;
}

export function ActivityDialog({ isOpen, onClose, onSave, activity }: ActivityDialogProps) {
  const [formData, setFormData] = useState<Partial<any>>({
    type: "Note",
    subject: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    performerId: "",
    leadId: "",
    opportunityId: "",
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        ...activity,
        date: new Date(activity.date).toISOString().slice(0, 16)
      });
    } else {
      setFormData({
        type: "Note",
        subject: "",
        description: "",
        date: new Date().toISOString().slice(0, 16),
        performerId: MOCK_USERS[0]?.id || "",
        leadId: "",
        opportunityId: "",
      });
    }
  }, [activity, isOpen]);

  const handleSave = () => {
    if (!formData.subject || !formData.performerId) return;
    
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      date: new Date(formData.date).toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            {activity ? "Edit Logged Activity" : "Log New Team Activity"}
          </DialogTitle>
          <DialogDescription>
            Record interactions, calls, or meetings to maintain a shared history of deal progress.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Activity Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Call</div>
                  </SelectItem>
                  <SelectItem value="Email">
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</div>
                  </SelectItem>
                  <SelectItem value="Meeting">
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Meeting</div>
                  </SelectItem>
                  <SelectItem value="Note">
                    <div className="flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Note</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Date & Time</Label>
              <Input 
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-xs font-bold uppercase text-muted-foreground">Subject / Title</Label>
            <Input 
              id="subject" 
              value={formData.subject} 
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Discovery call regarding cloud migration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase text-muted-foreground">Interaction Notes</Label>
            <Textarea 
              id="description"
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of what was discussed..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Team Member (Performer)</Label>
              <Select 
                value={formData.performerId} 
                onValueChange={(val) => setFormData({ ...formData, performerId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Linked Lead (Optional)</Label>
              <Select 
                value={formData.leadId} 
                onValueChange={(val) => setFormData({ ...formData, leadId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {MOCK_LEADS.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Linked Opportunity (Optional)</Label>
            <Select 
              value={formData.opportunityId} 
              onValueChange={(val) => setFormData({ ...formData, opportunityId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {MOCK_OPPORTUNITIES.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>{opt.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="font-bold">Discard</Button>
          <Button className="bg-accent hover:bg-accent/90 font-bold px-8" onClick={handleSave}>
            {activity ? "Update Log" : "Log Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
