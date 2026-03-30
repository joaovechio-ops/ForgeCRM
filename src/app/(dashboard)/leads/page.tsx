"use client";

import { useState, useEffect, useMemo } from "react";
import { MOCK_LEADS, MOCK_USERS } from "@/lib/mock-data";
import { Lead } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreVertical, Star, Download, FileSpreadsheet, Trash2, Pencil, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LeadDialog } from "@/components/crm/LeadDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LeadsPage() {
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    const savedLeads = localStorage.getItem('forge_crm_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      setLeads(MOCK_LEADS);
    }
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leads, searchQuery]);

  const handleAddLead = () => {
    setEditingLead(undefined);
    setIsDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem('forge_crm_leads', JSON.stringify(updated));
  };

  const handleSaveLead = (lead: Lead) => {
    let updated;
    if (editingLead) {
      updated = leads.map(l => l.id === lead.id ? lead : l);
    } else {
      updated = [lead, ...leads];
    }
    setLeads(updated);
    localStorage.setItem('forge_crm_leads', JSON.stringify(updated));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Leads & Prospects</h2>
          <p className="text-muted-foreground mt-1">Capture, score, and nurture your pipeline from initial contact.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-accent hover:bg-accent/90 shadow-sm font-bold" onClick={handleAddLead}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </header>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                className="pl-9 bg-muted/30 border-none shadow-none focus-visible:ring-1 focus-visible:ring-accent" 
                placeholder="Search leads..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Contact</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Company</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">AI Score</TableHead>
                <TableHead className="w-12 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-accent/5 transition-colors group">
                  <TableCell><Star className="w-4 h-4 text-muted-foreground" /></TableCell>
                  <TableCell onClick={() => handleEditLead(lead)}>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{lead.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{lead.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary/80">{lead.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[9px] uppercase font-bold", lead.status === 'Qualified' ? "text-green-700 bg-green-50" : "bg-muted")}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full"><div className="h-full bg-accent rounded-full" style={{width: `${lead.aiScore}%`}}></div></div>
                      <span className="text-[10px] font-bold">{lead.aiScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditLead(lead)}><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <LeadDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveLead} lead={editingLead} />
    </div>
  );
}
