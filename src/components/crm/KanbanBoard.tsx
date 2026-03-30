"use client";

import { useState } from "react";
import { Opportunity, OpportunityPipeline, User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  DollarSign, 
  Zap,
  ChevronRight,
  Target,
  Pencil,
  Trash2,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { generateOpportunitySummary } from "@/ai/flows/opportunity-summary-generator";
import { MOCK_USERS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STAGES: OpportunityPipeline[] = ['Discovery', 'Qualification', 'Proposal', 'Contracting', 'Closed Won', 'Closed Lost'];

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onEdit: (opt: Opportunity) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function KanbanBoard({ opportunities, onEdit, onDelete, onAdd }: KanbanBoardProps) {
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const getStageOpportunities = (stage: OpportunityPipeline) => 
    opportunities.filter(opt => opt.status === stage);

  const handleGenerateSummary = async (e: React.MouseEvent, opportunity: Opportunity) => {
    e.stopPropagation();
    setSummarizingId(opportunity.id);
    try {
      const result = await generateOpportunitySummary({ activityNotes: opportunity.activityNotes });
      console.log("Summary generated:", result.summary);
      // In a real app, you would update the opportunity state here
    } catch (error) {
      console.error("Failed to generate summary", error);
    } finally {
      setSummarizingId(null);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)] min-h-[600px] scrollbar-hide">
      {STAGES.map(stage => {
        const stageOpts = getStageOpportunities(stage);
        const totalValue = stageOpts.reduce((sum, o) => sum + (o.value || 0), 0);

        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="font-headline font-bold text-sm text-primary uppercase tracking-wider">{stage}</h3>
                <p className="text-xs text-muted-foreground font-medium">{stageOpts.length} deals • ${totalValue.toLocaleString()}</p>
              </div>
              <button 
                className="p-1 hover:bg-muted rounded transition-colors"
                onClick={onAdd}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {stageOpts.map(opt => {
                const margin = opt.value && opt.cost ? ((opt.value - opt.cost) / opt.value) * 100 : 0;
                const owner = MOCK_USERS.find(u => u.id === opt.ownerId);
                
                return (
                  <Card 
                    key={opt.id} 
                    className="group hover:border-accent hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-accent"
                    onClick={() => onEdit(opt)}
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm leading-tight line-clamp-2">{opt.title}</h4>
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className={cn(
                               "text-[9px] uppercase font-bold px-1 py-0 border-none",
                               opt.confidenceStatus === 'High' ? "text-green-600 bg-green-50" :
                               opt.confidenceStatus === 'Medium' ? "text-yellow-600 bg-yellow-50" :
                               "text-red-600 bg-red-50"
                             )}>
                               {opt.confidenceStatus}
                             </Badge>
                             <Badge variant="ghost" className="text-[9px] font-bold text-muted-foreground p-0">
                               {opt.probability}% PROB
                             </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleGenerateSummary(e, opt)} disabled={summarizingId === opt.id}>
                              <Zap className="w-4 h-4 mr-2 text-accent" />
                              AI Summary
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(opt)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Deal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(opt.id); }} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase font-bold px-1.5">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {(opt.value || 0).toLocaleString()} {opt.currency}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 border-muted">
                          <Calendar className="w-3 h-3 mr-1" />
                          {opt.expectedCloseDate}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold border-none",
                          margin > 40 ? "text-green-600" : "text-muted-foreground"
                        )}>
                          {margin.toFixed(0)}% MARGIN
                        </Badge>
                      </div>

                      {opt.activityNotes && opt.activityNotes.length > 0 && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          <span>{opt.activityNotes.length} interactions recorded</span>
                        </div>
                      )}

                      {opt.nextStep && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                          <Target className="w-3 h-3 text-accent" />
                          <span className="truncate">Next: {opt.nextStep}</span>
                        </div>
                      )}

                      <div className="pt-2 flex justify-between items-center border-t border-muted/30">
                        <div className="flex items-center gap-2">
                          {owner && (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6 border-2 border-background">
                                <AvatarImage src={owner.avatar} />
                                <AvatarFallback>{owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{owner.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          View details <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
