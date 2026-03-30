
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ArrowUpRight,
  MessageSquare,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Star,
  ChevronRight,
  Pencil,
  User as UserIcon,
  Handshake,
  Target,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Zap,
  FileText,
  TrendingDown,
  Activity as ActivityIcon
} from "lucide-react";
import { MetricCard } from "@/components/crm/MetricCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { OpportunityDialog } from "@/components/crm/OpportunityDialog";
import { MOCK_LEADS, MOCK_ACTIVITIES, MOCK_OPPORTUNITIES, MOCK_USERS, MOCK_QUOTAS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Opportunity, OpportunityPipeline, Quota, Lead, Activity } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  format, 
  subDays, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  parseISO, 
  differenceInDays,
  startOfYear,
  isAfter,
  isBefore,
  startOfToday
} from "date-fns";

const COLORS = ['#023567', '#4A90E2', '#F8B8B9', '#10B981', '#F59E0B'];

type DateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>(undefined);
  
  // Entity State
  const [quotas, setQuotas] = useState<Quota[]>(MOCK_QUOTAS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  
  // Filter States
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("all");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("all");
  const [selectedRange, setSelectedRange] = useState<DateRange>("30d");

  useEffect(() => {
    setIsMounted(true);
    
    const savedQuotas = localStorage.getItem('forge_crm_quotas');
    if (savedQuotas) setQuotas(JSON.parse(savedQuotas));

    const savedOpps = localStorage.getItem('forge_crm_opportunities');
    if (savedOpps) setOpportunities(JSON.parse(savedOpps));

    const savedLeads = localStorage.getItem('forge_crm_leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));

    const savedActs = localStorage.getItem('forge_crm_activities');
    if (savedActs) setActivities(JSON.parse(savedActs));
  }, []);

  // Range Intervals Calculation
  const rangeContext = useMemo(() => {
    const now = new Date();
    let start: Date;
    let prevStart: Date;
    let prevEnd: Date;

    switch (selectedRange) {
      case '7d':
        start = subDays(now, 7);
        prevStart = subDays(start, 7);
        prevEnd = start;
        break;
      case '30d':
        start = subDays(now, 30);
        prevStart = subDays(start, 30);
        prevEnd = start;
        break;
      case '90d':
        start = subDays(now, 90);
        prevStart = subDays(start, 90);
        prevEnd = start;
        break;
      case 'ytd':
        start = startOfYear(now);
        const yearDays = differenceInDays(now, start);
        prevStart = subDays(start, yearDays || 365);
        prevEnd = start;
        break;
      case 'all':
      default:
        start = new Date(0);
        prevStart = new Date(0);
        prevEnd = new Date(0);
        break;
    }

    return { 
      currentStart: start, 
      currentEnd: now, 
      lastStart: prevStart, 
      lastEnd: prevEnd 
    };
  }, [selectedRange]);

  // Base Data Filtering
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opt => {
      const matchesOwner = selectedOwnerId === "all" || opt.ownerId === selectedOwnerId;
      const matchesPartner = selectedPartnerId === "all" || opt.partnerId === selectedPartnerId;
      const closeDate = new Date(opt.expectedCloseDate);
      const matchesRange = selectedRange === 'all' || isWithinInterval(closeDate, { start: rangeContext.currentStart, end: rangeContext.currentEnd });
      return matchesOwner && matchesPartner && matchesRange;
    });
  }, [opportunities, selectedOwnerId, selectedPartnerId, selectedRange, rangeContext]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesOwner = selectedOwnerId === "all" || l.assignedTo === selectedOwnerId;
      const createdAt = parseISO(l.createdAt);
      const matchesRange = selectedRange === 'all' || isWithinInterval(createdAt, { start: rangeContext.currentStart, end: rangeContext.currentEnd });
      return matchesOwner && matchesRange;
    });
  }, [leads, selectedOwnerId, selectedRange, rangeContext]);

  const filteredActivities = useMemo(() => {
    let base = [...activities];
    if (selectedOwnerId !== "all") base = base.filter(a => a.performerId === selectedOwnerId);
    return base.filter(a => {
      const actDate = new Date(a.date);
      return selectedRange === 'all' || isWithinInterval(actDate, { start: rangeContext.currentStart, end: rangeContext.currentEnd });
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [activities, selectedOwnerId, selectedRange, rangeContext]);

  // Quota Calculation
  const quotaAttainment = useMemo(() => {
    const currentUserId = 'user-1'; 
    const ACTIVE_PERIOD = 'Q1 2025';
    const userQuota = quotas.find(q => q.userId === currentUserId && q.period === ACTIVE_PERIOD);
    const target = userQuota?.amount || 0;
    
    const qStart = new Date(2025, 0, 1);
    const qEnd = new Date(2025, 2, 31, 23, 59, 59);
    
    const now = startOfToday();
    const totalDaysInQ = differenceInDays(qEnd, qStart) + 1;
    const daysPassedInQ = Math.max(0, Math.min(totalDaysInQ, differenceInDays(now, qStart)));
    const timeElapsedPercent = Math.round((daysPassedInQ / totalDaysInQ) * 100);

    const closedWon = opportunities.filter(o => 
      o.ownerId === currentUserId && 
      o.status === 'Closed Won' && 
      isWithinInterval(new Date(o.expectedCloseDate), { start: qStart, end: qEnd })
    );
    
    const actual = closedWon.reduce((sum, o) => sum + (o.value || 0), 0);
    const percent = target > 0 ? Math.round((actual / target) * 100) : 0;
    const gap = Math.max(0, target - actual);
    const isOnTrack = percent >= timeElapsedPercent;
    
    return { 
      actual, 
      target, 
      percent, 
      gap, 
      isOnTrack, 
      daysRemaining: Math.max(0, differenceInDays(qEnd, now))
    };
  }, [quotas, opportunities]);

  // Metric Variation Logic
  const calculateMetrics = useMemo(() => {
    const getWinRate = (items: Opportunity[]) => {
      const closed = items.filter(o => o.status === 'Closed Won' || o.status === 'Closed Lost');
      return closed.length === 0 ? 0 : (items.filter(o => o.status === 'Closed Won').length / closed.length) * 100;
    };

    const getAvgSalesCycle = (items: Opportunity[]) => {
      const won = items.filter(o => o.status === 'Closed Won');
      if (won.length === 0) return 0;
      const totalDays = won.reduce((sum, o) => {
        const start = new Date(o.createdAt);
        const end = new Date(o.expectedCloseDate);
        return sum + differenceInDays(end, start);
      }, 0);
      return Math.round(totalDays / won.length);
    };

    const currentOpps = filteredOpportunities;
    const lastOpps = opportunities.filter(o => {
      const matchesOwner = selectedOwnerId === "all" || o.ownerId === selectedOwnerId;
      const matchesPartner = selectedPartnerId === "all" || o.partnerId === selectedPartnerId;
      return isWithinInterval(new Date(o.expectedCloseDate), { start: rangeContext.lastStart, end: rangeContext.lastEnd }) && matchesOwner && matchesPartner;
    });

    const currValue = currentOpps.reduce((sum, o) => sum + (o.value || 0), 0);
    const lastValue = lastOpps.reduce((sum, o) => sum + (o.value || 0), 0);
    
    const currWR = getWinRate(currentOpps);
    const lastWR = getWinRate(lastOpps);

    const currSize = currentOpps.length === 0 ? 0 : currValue / currentOpps.length;
    const lastSize = lastOpps.length === 0 ? 0 : lastValue / lastOpps.length;

    const currCycle = getAvgSalesCycle(currentOpps);
    const lastCycle = getAvgSalesCycle(lastOpps);

    const calcChange = (c: number, l: number) => {
      if (l === 0) return c > 0 ? "+100%" : "0%";
      const change = ((c - l) / l) * 100;
      return (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
    };

    return {
      pipeline: { value: `$${(currValue / 1000).toFixed(0)}k`, change: calcChange(currValue, lastValue), trend: currValue >= lastValue ? "up" : "down" },
      winRate: { value: `${currWR.toFixed(1)}%`, change: calcChange(currWR, lastWR), trend: currWR >= lastWR ? "up" : "down" },
      avgSize: { value: `$${(currSize / 1000).toFixed(0)}k`, change: calcChange(currSize, lastSize), trend: currSize >= lastSize ? "up" : "down" },
      salesCycle: { value: `${currCycle} Days`, change: calcChange(currCycle, lastCycle), trend: currCycle <= lastCycle ? "up" : "down" }
    };
  }, [opportunities, filteredOpportunities, selectedOwnerId, selectedPartnerId, rangeContext]);

  // Chart Logic
  const performanceData = useMemo(() => {
    const months = [];
    const latestDate = opportunities.length > 0 ? new Date(Math.max(...opportunities.map(o => new Date(o.expectedCloseDate).getTime()))) : new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(latestDate, i);
      months.push({ label: format(date, 'MMM'), start: startOfMonth(date), end: endOfMonth(date), revenue: 0 });
    }
    
    filteredOpportunities.forEach(opt => {
      const closeDate = new Date(opt.expectedCloseDate);
      months.forEach(m => { if (isWithinInterval(closeDate, { start: m.start, end: m.end })) m.revenue += opt.value || 0; });
    });
    return months.map(m => ({ month: m.label, revenue: m.revenue }));
  }, [filteredOpportunities, opportunities]);

  const conversionData = useMemo(() => {
    const stages: OpportunityPipeline[] = ['Discovery', 'Qualification', 'Proposal', 'Contracting', 'Closed Won'];
    return stages.map(stage => ({
      name: stage,
      value: filteredOpportunities.filter(o => o.status === stage).length
    })).filter(s => s.value > 0);
  }, [filteredOpportunities]);

  const handleSaveOpportunity = (updated: Opportunity) => {
    const newOpps = opportunities.map(o => o.id === updated.id ? updated : o);
    setOpportunities(newOpps);
    localStorage.setItem('forge_crm_opportunities', JSON.stringify(newOpps));
    setIsDialogOpen(false);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Sales Intelligence</h2>
            <p className="text-muted-foreground mt-1">Unified view of performance across your team and partners.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-md border shadow-sm">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={selectedRange} onValueChange={(val: DateRange) => setSelectedRange(val)}>
                <SelectTrigger className="w-[140px] h-7 border-none bg-transparent p-0 text-xs font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-md border shadow-sm">
              <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
                <SelectTrigger className="w-[140px] h-7 border-none bg-transparent p-0 text-xs font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {MOCK_USERS.filter(u => u.status === 'active').map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm min-w-[320px]">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Quota Attainment (Q1)</p>
              <Badge className={cn("px-1.5 py-0 text-[9px] font-bold", quotaAttainment.isOnTrack ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                {quotaAttainment.isOnTrack ? "ON TRACK" : "BEHIND PACE"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", quotaAttainment.isOnTrack ? "bg-accent" : "bg-orange-500")} style={{ width: `${quotaAttainment.percent}%` }} />
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary">${(quotaAttainment.actual / 1000).toFixed(0)}k / ${(quotaAttainment.target / 1000).toFixed(0)}k</span>
                <span className="text-muted-foreground">{quotaAttainment.daysRemaining} days left</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center ml-4">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gap to Goal</p>
            <p className="text-lg font-bold text-primary">${(quotaAttainment.gap / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </header>

      {/* AI Intelligence Banner */}
      <Card className="bg-primary/5 border-primary/20 shadow-none overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-primary p-6 md:p-8 flex items-center justify-center">
              <Zap className="w-10 h-10 text-secondary animate-pulse" />
            </div>
            <div className="p-6 md:p-8 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-secondary text-primary font-bold">AI STRATEGY</Badge>
                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Pipeline Recommendation</span>
              </div>
              <h3 className="text-xl font-bold text-primary">Focus on "Enterprise Software License" this week.</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Our analysis shows a 60% conversion probability with a stagnant 4-day lag. Closing this would bridge 20% of your remaining Q1 gap.
              </p>
            </div>
            <div className="p-6 md:p-8">
              <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">Execute Strategy</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard title="Pipeline Value" value={calculateMetrics.pipeline.value} change={calculateMetrics.pipeline.change} trend={calculateMetrics.pipeline.trend} icon={DollarSign} />
        <MetricCard title="Win Rate" value={calculateMetrics.winRate.value} change={calculateMetrics.winRate.change} trend={calculateMetrics.winRate.trend} icon={Target} />
        <MetricCard title="Avg. Deal Size" value={calculateMetrics.avgSize.value} change={calculateMetrics.avgSize.change} trend={calculateMetrics.avgSize.trend} icon={TrendingUp} />
        <MetricCard title="Active Leads" value={filteredLeads.length} change="+12.5%" trend="up" icon={Users} />
        <MetricCard title="Sales Cycle" value={calculateMetrics.salesCycle.value} change={calculateMetrics.salesCycle.change} trend={calculateMetrics.salesCycle.trend} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Revenue Performance</CardTitle>
              <CardDescription>Actual revenue aggregated by expected close month.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <div className="w-3 h-3 bg-primary rounded" /> Forecasted
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 12, fontWeight: 600}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 12, fontWeight: 600}}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(2, 53, 103, 0.05)'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} 
                />
                <Bar dataKey="revenue" fill="#023567" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Funnel Distribution</CardTitle>
            <CardDescription>Opportunity volume by pipeline stage.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col min-h-[350px]">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={conversionData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {conversionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-6">
              {conversionData.map((item, i) => (
                <div key={item.name} className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: COLORS[i % COLORS.length]}} /> 
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-primary font-bold">{item.value} Deals</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Pipeline Activity</CardTitle>
              <CardDescription>The latest interactions logged by your sales team.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent font-bold gap-2" asChild>
              <Link href="/activities">
                <ActivityIcon className="w-4 h-4" /> VIEW ALL
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-muted">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {activity.type === 'Call' ? <Phone className="w-4 h-4" /> : 
                     activity.type === 'Email' ? <Mail className="w-4 h-4" /> : 
                     activity.type === 'Meeting' ? <CalendarIcon className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-primary truncate">{activity.subject}</h4>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-primary uppercase">{format(new Date(activity.date), "MMM d")}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(activity.date), "h:mm a")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FileText className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Reports</CardTitle>
            <CardDescription className="text-primary-foreground/70">Access deep-dive analysis modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/20 justify-between group" variant="outline">
              Win/Loss Analysis <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/20 justify-between group" variant="outline">
              Partner Revenue <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/20 justify-between group" variant="outline">
              Lead Velocity <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">Export Pipeline</p>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-secondary text-primary font-bold text-[10px] h-8" size="sm">PDF SUMMARY</Button>
                <Button className="bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] h-8" size="sm">EXCEL DATA</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OpportunityDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveOpportunity} opportunity={editingOpportunity} />
    </div>
  );
}
