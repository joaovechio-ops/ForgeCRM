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
import { Quota } from "@/lib/types";
import { MOCK_USERS, MOCK_QUOTAS } from "@/lib/mock-data";
import { Target, DollarSign, Calendar } from "lucide-react";

interface QuotaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quotas: Quota[]) => void;
  currentQuotas: Quota[];
}

export function QuotaDialog({ isOpen, onClose, onSave, currentQuotas }: QuotaDialogProps) {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const activeUsers = MOCK_USERS.filter(u => u.status === 'active');
  const ACTIVE_PERIOD = 'Q1 2025';

  useEffect(() => {
    if (isOpen) {
      setQuotas(currentQuotas.length > 0 ? currentQuotas : MOCK_QUOTAS);
    }
  }, [isOpen, currentQuotas]);

  const handleUpdateQuota = (userId: string, amount: number) => {
    setQuotas(prev => {
      const existing = prev.find(q => q.userId === userId && q.period === ACTIVE_PERIOD);
      if (existing) {
        return prev.map(q => q.userId === userId && q.period === ACTIVE_PERIOD ? { ...q, amount } : q);
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        amount,
        period: ACTIVE_PERIOD,
        currency: 'USD'
      }];
    });
  };

  const handleSave = () => {
    onSave(quotas);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-accent" /> Team Quota Management</DialogTitle>
          <DialogDescription>Define quarterly targets for team members to drive attainment analytics.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="p-3 bg-muted/30 rounded-lg flex items-center gap-2"><Calendar className="w-4 h-4" /> <span className="text-sm font-bold">Active Period: {ACTIVE_PERIOD}</span></div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {activeUsers.map(user => {
              const q = quotas.find(q => q.userId === user.id && q.period === ACTIVE_PERIOD);
              return (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-bold">{user.name}</span>
                  <div className="relative w-32">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input type="number" className="pl-7 h-9 font-bold" value={q?.amount || 0} onChange={(e) => handleUpdateQuota(user.id, Number(e.target.value))} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Discard</Button>
          <Button className="bg-accent hover:bg-accent/90 px-8 font-bold" onClick={handleSave}>Apply Targets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
