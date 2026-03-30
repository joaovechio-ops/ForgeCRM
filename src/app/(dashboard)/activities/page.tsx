
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Search, 
  Plus,
  Clock,
  User,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_ACTIVITIES, MOCK_LEADS, MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { format, isAfter, subDays, startOfDay } from "date-fns";
import { ActivityDialog } from "@/components/crm/ActivityDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ActivitiesPage() {
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(undefined);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('forge_crm_activities');
    if (saved) {
      setActivities(JSON.parse(saved));
    } else {
      setActivities(MOCK_ACTIVITIES);
    }
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesType = filterType ? activity.type === filterType : true;
      const matchesSearch = searchQuery 
        ? activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, filterType, searchQuery]);

  // Robust calculation for the "Last 7 Days Summary"
  const stats = useMemo(() => {
    const horizon = startOfDay(subDays(new Date(), 7));
    const recent = activities.filter(a => isAfter(new Date(a.date), horizon));
    
    return {
      calls: recent.filter(a => a.type === 'Call').length,
      emails: recent.filter(a => a.type === 'Email').length,
      meetings: recent.filter(a => a.type === 'Meeting').length,
      notes: recent.filter(a => a.type === 'Note').length,
      total: recent.length
    };
  }, [activities]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <CalendarIcon className="w-4 h-4" />;
      case 'Note': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Call': return "text-blue-600 bg-blue-50";
      case 'Email': return "text-purple-600 bg-purple-50";
      case 'Meeting': return "text-green-600 bg-green-50";
      case 'Note': return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleLogActivity = () => {
    setEditingActivity(undefined);
    setIsDialogOpen(true);
  };

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setIsDialogOpen(true);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    localStorage.setItem('forge_crm_activities', JSON.stringify(updated));
  };

  const handleSaveActivity = (activity: any) => {
    let updated;
    if (editingActivity) {
      updated = activities.map(a => a.id === activity.id ? activity : a);
    } else {
      updated = [activity, ...activities];
    }
    setActivities(updated);
    localStorage.setItem('forge_crm_activities', JSON.stringify(updated));
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-primary font-bold">Loading Activity Stream...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Activity Stream</h2>
          <p className="text-muted-foreground mt-1">A chronological record of all team interactions.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 shadow-sm font-bold" onClick={handleLogActivity}>
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 h-fit shadow-sm border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary/70 uppercase">Activity Type</label>
              <div className="flex flex-wrap gap-2">
                {['Call', 'Email', 'Meeting', 'Note'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-[10px] uppercase font-bold px-2 h-7 rounded-full",
                      filterType === type && "bg-primary text-primary-foreground border-primary"
                    )}
                    onClick={() => setFilterType(filterType === type ? null : type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-tight">
                    <Clock className="w-3.5 h-3.5" />
                    Last 7 Days
                  </h4>
                  <Badge variant="outline" className="text-[9px] font-bold bg-white">{stats.total} Total</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3 h-3 opacity-60" /> Calls
                    </span>
                    <span className="font-bold text-primary">{stats.calls}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3 h-3 opacity-60" /> Emails
                    </span>
                    <span className="font-bold text-primary">{stats.emails}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3 opacity-60" /> Meetings
                    </span>
                    <span className="font-bold text-primary">{stats.meetings}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 opacity-60" /> Notes
                    </span>
                    <span className="font-bold text-primary">{stats.notes}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-primary/10 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Velocity is active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9 bg-card border-none shadow-sm focus-visible:ring-1 focus-visible:ring-accent" 
              placeholder="Search by subject or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
            {filteredActivities.map((activity, idx) => {
              const lead = MOCK_LEADS.find(l => l.id === activity.leadId);
              const opportunity = MOCK_OPPORTUNITIES.find(o => o.id === activity.opportunityId);

              return (
                <div key={activity.id} className="relative flex items-start gap-6 group animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  {/* Timeline Dot */}
                  <div className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-4 ring-background z-10 transition-transform group-hover:scale-110",
                    getActivityColor(activity.type)
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>

                  <Card className="flex-1 shadow-sm border-none group-hover:shadow-md transition-shadow relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-primary">{activity.subject}</h4>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter h-5 px-1.5 border-muted">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-start gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                              {format(new Date(activity.date), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Entry
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteActivity(activity.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Entry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-4">
                        {lead && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                            <span className="font-medium text-primary">{lead.name}</span>
                            <span className="opacity-60">({lead.company})</span>
                          </div>
                        )}
                        {opportunity && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/5 px-2 py-1 rounded border border-accent/10">
                            <ExternalLink className="w-3 h-3 text-accent" />
                            <span className="font-medium text-accent">{opportunity.title}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {filteredActivities.length === 0 && (
              <div className="text-center py-20 bg-card rounded-lg border border-dashed">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary">No activities found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
                <Button 
                  variant="link" 
                  className="mt-2 text-accent"
                  onClick={() => { setFilterType(null); setSearchQuery(""); }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ActivityDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />
    </div>
  );
}
