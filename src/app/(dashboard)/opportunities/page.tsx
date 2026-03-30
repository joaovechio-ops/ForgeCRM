"use client";

import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { MOCK_OPPORTUNITIES, MOCK_PARTNERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, Search, Handshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OpportunityDialog } from "@/components/crm/OpportunityDialog";
import { Opportunity } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OpportunitiesPage() {
  const [mounted, setMounted] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('forge_crm_opportunities');
    if (saved) {
      setOpportunities(JSON.parse(saved));
    } else {
      setOpportunities(MOCK_OPPORTUNITIES);
    }
  }, []);

  const handleAddDeal = () => {
    setEditingOpportunity(undefined);
    setIsDialogOpen(true);
  };

  const handleEditDeal = (opt: Opportunity) => {
    setEditingOpportunity(opt);
    setIsDialogOpen(true);
  };

  const handleDeleteDeal = (id: string) => {
    const updated = opportunities.filter(o => o.id !== id);
    setOpportunities(updated);
    localStorage.setItem('forge_crm_opportunities', JSON.stringify(updated));
  };

  const handleSaveDeal = (deal: Opportunity) => {
    let updated;
    if (editingOpportunity) {
      updated = opportunities.map(o => o.id === deal.id ? deal : o);
    } else {
      updated = [deal, ...opportunities];
    }
    setOpportunities(updated);
    localStorage.setItem('forge_crm_opportunities', JSON.stringify(updated));
    setIsDialogOpen(false);
  };

  if (!mounted) return null;

  const filteredOpportunities = opportunities.filter(opt => {
    const matchesSearch = opt.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPartner = selectedPartnerId === "all" || opt.partnerId === selectedPartnerId;
    return matchesSearch && matchesPartner;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Opportunity Pipeline</h2>
          <p className="text-muted-foreground mt-1">Manage and track your active sales deals.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            className="pl-9 bg-card border-none shadow-sm max-w-xs" 
            placeholder="Search deals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="bg-accent hover:bg-accent/90" onClick={handleAddDeal}><Plus className="w-4 h-4 mr-2" /> New Deal</Button>
        </div>
      </header>
      <KanbanBoard opportunities={filteredOpportunities} onEdit={handleEditDeal} onDelete={handleDeleteDeal} onAdd={handleAddDeal} />
      <OpportunityDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveDeal} opportunity={editingOpportunity} />
    </div>
  );
}
