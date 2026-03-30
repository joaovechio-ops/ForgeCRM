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
import { 
  Opportunity, 
  OpportunityPipeline, 
  OpportunityService, 
  ServiceItem, 
  Partner, 
  Lead,
  User
} from "@/lib/types";
import { MOCK_SERVICES, MOCK_PARTNERS, MOCK_LEADS, MOCK_USERS } from "@/lib/mock-data";
import { Plus, Trash2, Calculator, Percent, DollarSign, Info, Target, MessageSquare, PlusCircle, Globe, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface OpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (opportunity: Opportunity) => void;
  opportunity?: Opportunity;
}

const CURRENCIES = ["USD", "EUR", "GBP", "BRL"];

export function OpportunityDialog({ isOpen, onClose, onSave, opportunity }: OpportunityDialogProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: "",
    status: "Discovery",
    currency: "USD",
    probability: 30,
    confidenceStatus: "Medium",
    expectedCloseDate: new Date().toISOString().split('T')[0],
    services: [],
    activityNotes: [],
    value: 0,
    cost: 0,
    nextStep: "",
    ownerId: "",
  });

  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
    } else {
      setFormData({
        title: "",
        status: "Discovery",
        currency: "USD",
        probability: 30,
        confidenceStatus: "Medium",
        expectedCloseDate: new Date().toISOString().split('T')[0],
        services: [],
        activityNotes: [],
        value: 0,
        cost: 0,
        nextStep: "",
        ownerId: "",
      });
    }
  }, [opportunity, isOpen]);

  const calculateTotals = (services: OpportunityService[]) => {
    const totalValue = services.reduce((sum, s) => sum + (s.unitPrice * s.quantity * (1 + s.taxRate / 100)), 0);
    const totalCost = services.reduce((sum, s) => sum + (s.unitCost * s.quantity), 0);
    return { totalValue, totalCost };
  };

  const addService = (serviceId: string) => {
    const service = MOCK_SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    const newLine: OpportunityService = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: service.id,
      quantity: 1,
      unitPrice: service.basePrice,
      unitCost: service.cost,
      currency: formData.currency || "USD",
      taxRate: 0,
      unit: service.unit,
    };

    const newServices = [...(formData.services || []), newLine];
    const { totalValue, totalCost } = calculateTotals(newServices);
    setFormData({ ...formData, services: newServices, value: totalValue, cost: totalCost });
  };

  const updateService = (id: string, updates: Partial<OpportunityService>) => {
    const newServices = (formData.services || []).map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    const { totalValue, totalCost } = calculateTotals(newServices);
    setFormData({ ...formData, services: newServices, value: totalValue, cost: totalCost });
  };

  const removeService = (id: string) => {
    const newServices = (formData.services || []).filter(s => s.id !== id);
    const { totalValue, totalCost } = calculateTotals(newServices);
    setFormData({ ...formData, services: newServices, value: totalValue, cost: totalCost });
  };

  const handleCurrencyChange = (val: string) => {
    const newServices = (formData.services || []).map(s => ({ ...s, currency: val }));
    setFormData({ ...formData, currency: val, services: newServices });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = [newNote, ...(formData.activityNotes || [])];
    setFormData({ ...formData, activityNotes: updatedNotes });
    setNewNote("");
  };

  const handleSave = () => {
    if (!formData.title || !formData.leadId) return;
    onSave({
      ...formData as Opportunity,
      id: formData.id || Math.random().toString(36).substr(2, 9),
    });
    onClose();
  };

  const margin = formData.value && formData.cost 
    ? ((formData.value - formData.cost) / formData.value) * 100 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {opportunity ? "Deal Details" : "New Opportunity"}
            {opportunity && <Badge variant="outline" className="ml-2 bg-accent/5 text-accent border-accent/20">{formData.status}</Badge>}
          </DialogTitle>
          <DialogDescription>
            Comprehensive overview and management of this sales opportunity.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent h-12 w-full justify-start gap-4 p-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-0 font-bold uppercase text-[10px] tracking-widest">General Info</TabsTrigger>
              <TabsTrigger value="proposal" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-0 font-bold uppercase text-[10px] tracking-widest">Proposal & Services</TabsTrigger>
              <TabsTrigger value="engagement" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-0 font-bold uppercase text-[10px] tracking-widest">Engagement & Notes</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            <TabsContent value="overview" className="m-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs uppercase font-bold text-muted-foreground">Opportunity Title</Label>
                    <Input 
                      id="title" 
                      value={formData.title} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Enterprise Software License"
                      className="font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Lead / Customer</Label>
                      <Select 
                        value={formData.leadId} 
                        onValueChange={val => setFormData({ ...formData, leadId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_LEADS.map(lead => (
                            <SelectItem key={lead.id} value={lead.id}>{lead.name} ({lead.company})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Owner / Manager</Label>
                      <Select 
                        value={formData.ownerId} 
                        onValueChange={val => setFormData({ ...formData, ownerId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_USERS.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Partner</Label>
                      <Select 
                        value={formData.partnerId} 
                        onValueChange={val => setFormData({ ...formData, partnerId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {MOCK_PARTNERS.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.company}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Pipeline Stage</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={val => setFormData({ ...formData, status: val as OpportunityPipeline })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Discovery">Discovery</SelectItem>
                          <SelectItem value="Qualification">Qualification</SelectItem>
                          <SelectItem value="Proposal">Proposal</SelectItem>
                          <SelectItem value="Contracting">Contracting</SelectItem>
                          <SelectItem value="Closed Won">Closed Won</SelectItem>
                          <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Expected Close</Label>
                      <Input 
                        type="date" 
                        value={formData.expectedCloseDate} 
                        onChange={e => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs uppercase font-bold text-muted-foreground">Confidence</Label>
                       <Select 
                         value={formData.confidenceStatus} 
                         onValueChange={val => setFormData({ ...formData, confidenceStatus: val as any })}
                       >
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Low">Low</SelectItem>
                           <SelectItem value="Medium">Medium</SelectItem>
                           <SelectItem value="High">High</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Currency</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={handleCurrencyChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Win Prob. (%)</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={formData.probability} 
                        onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-inner space-y-6 relative overflow-hidden">
                   <div className="absolute -right-4 -bottom-4 opacity-10">
                     <Calculator className="w-32 h-32" />
                   </div>
                   <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                     <Calculator className="w-4 h-4" />
                     Financial Intelligence
                   </h4>
                   <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-end">
                       <span className="text-sm opacity-70">Projected Revenue</span>
                       <span className="text-2xl font-bold">{formData.value?.toLocaleString()} {formData.currency}</span>
                     </div>
                     <div className="flex justify-between items-end">
                       <span className="text-sm opacity-70">Estimated Cost</span>
                       <span className="text-lg font-medium">{formData.cost?.toLocaleString()} {formData.currency}</span>
                     </div>
                     <Separator className="bg-white/20" />
                     <div className="flex justify-between items-center pt-2">
                       <span className="text-sm font-bold">Net Margin</span>
                       <Badge className={cn(
                         "text-lg font-bold border-none",
                         margin > 30 ? "bg-green-500 text-white" : "bg-white/20 text-white"
                       )}>
                         {margin.toFixed(1)}%
                       </Badge>
                     </div>
                   </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="proposal" className="m-0 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Proposed Services
                  </h4>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pricing Currency:</Label>
                    <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger className="w-24 h-7 text-[10px] font-bold bg-muted/50 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Select onValueChange={addService}>
                  <SelectTrigger className="w-[200px] h-8 text-xs bg-muted/50 border-none">
                    <Plus className="w-3 h-3 mr-2" />
                    Add from Repository
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_SERVICES.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-widest text-[9px]">Service</th>
                      <th className="px-4 py-3 w-20 text-center font-bold uppercase tracking-widest text-[9px]">Qty</th>
                      <th className="px-4 py-3 w-32 text-right font-bold uppercase tracking-widest text-[9px]">Price ({formData.currency})</th>
                      <th className="px-4 py-3 w-32 text-right font-bold uppercase tracking-widest text-[9px]">Cost ({formData.currency})</th>
                      <th className="px-4 py-3 w-20 text-right font-bold uppercase tracking-widest text-[9px]">Tax %</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.services?.map((s) => {
                      const item = MOCK_SERVICES.find(srv => srv.id === s.serviceId);
                      return (
                        <tr key={s.id} className="hover:bg-accent/5 transition-colors group">
                          <td className="px-4 py-3">
                            <p className="font-bold text-primary">{item?.name || "Service Item"}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{s.unit}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Input 
                              type="number" 
                              value={s.quantity} 
                              onChange={e => updateService(s.id, { quantity: Number(e.target.value) })}
                              className="h-8 text-center text-xs font-bold border-none bg-muted/30"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-[10px] font-bold text-muted-foreground">{formData.currency}</span>
                              <Input 
                                type="number" 
                                value={s.unitPrice} 
                                onChange={e => updateService(s.id, { unitPrice: Number(e.target.value) })}
                                className="h-8 w-20 text-right text-xs font-bold border-none bg-muted/30"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center gap-1 justify-end opacity-60">
                              <span className="text-[10px] font-bold text-muted-foreground">{formData.currency}</span>
                              <Input 
                                type="number" 
                                value={s.unitCost} 
                                onChange={e => updateService(s.id, { unitCost: Number(e.target.value) })}
                                className="h-8 w-20 text-right text-xs border-none bg-muted/10"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-muted-foreground">
                            {s.taxRate}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeService(s.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!formData.services || formData.services.length === 0) && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground italic bg-muted/10">
                          <div className="flex flex-col items-center gap-2">
                             <PlusCircle className="w-8 h-8 opacity-20" />
                             <span>No services added to this proposal yet.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="m-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-xs uppercase tracking-widest text-primary">Customer Interaction Log</h4>
                    </div>
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Add a new note about the latest interaction..." 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button className="bg-accent h-auto px-4" onClick={handleAddNote}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.activityNotes?.map((note, idx) => (
                        <div key={idx} className="p-4 bg-muted/30 rounded-lg border border-transparent hover:border-accent/20 transition-colors">
                          <p className="text-sm leading-relaxed">{note}</p>
                          <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-wider">Logged Interaction</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-xs uppercase tracking-widest text-accent">Next Step Strategy</h4>
                    </div>
                    <Textarea 
                      placeholder="What is the immediate next step for this deal?"
                      value={formData.nextStep}
                      onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                      className="text-xs bg-white/50"
                    />
                    <div className="text-[10px] text-muted-foreground leading-tight italic">
                      Clearly defined next steps increase conversion velocity by up to 22%.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose} className="font-bold">Discard Changes</Button>
          <Button className="bg-accent hover:bg-accent/90 px-8 font-bold shadow-md shadow-accent/20" onClick={handleSave}>
            Save Opportunity Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
