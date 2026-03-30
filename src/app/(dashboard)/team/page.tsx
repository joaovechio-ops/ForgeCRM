"use client";

import { useState, useEffect } from "react";
import { MOCK_USERS, MOCK_QUOTAS } from "@/lib/mock-data";
import { User, Quota } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Mail, Shield, User as UserIcon, MoreVertical, Pencil, Calendar, History, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TeamMemberDialog } from "@/components/crm/TeamMemberDialog";
import { QuotaDialog } from "@/components/crm/QuotaDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeamPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    // Load quotas from localStorage or fallback to MOCK_QUOTAS
    const savedQuotas = localStorage.getItem('forge_crm_quotas');
    if (savedQuotas) {
      setQuotas(JSON.parse(savedQuotas));
    } else {
      setQuotas(MOCK_QUOTAS);
    }
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-primary font-bold">Loading Team...</div>
    </div>
  );

  const handleAddMember = () => {
    setEditingUser(undefined);
    setIsDialogOpen(true);
  };

  const handleEditMember = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveMember = (user: User) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    } else {
      setUsers(prev => [user, ...prev]);
    }
  };

  const handleSaveQuotas = (updatedQuotas: Quota[]) => {
    setQuotas(updatedQuotas);
    localStorage.setItem('forge_crm_quotas', JSON.stringify(updatedQuotas));
  };

  const handleToggleStatus = (user: User) => {
    const updatedStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUser = { 
      ...user, 
      status: updatedStatus,
      lastDay: updatedStatus === 'inactive' ? new Date().toISOString().split('T')[0] : undefined
    };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = users.filter(u => u.status === 'active').length;
  const inactiveCount = users.filter(u => u.status === 'inactive').length;

  const getRoleBadgeStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return "bg-red-50 text-red-700";
      case 'manager': return "bg-blue-50 text-blue-700";
      case 'sales': return "bg-green-50 text-green-700";
      default: return "bg-purple-50 text-purple-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Team Management</h2>
          <p className="text-muted-foreground mt-1">Manage opportunity owners, lifecycle, and permissions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 font-bold" onClick={() => setIsQuotaDialogOpen(true)}>
            <Target className="w-4 h-4 mr-2" />
            Manage Quotas
          </Button>
          <Button className="bg-accent hover:bg-accent/90 shadow-sm" onClick={handleAddMember}>
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-primary-foreground relative overflow-hidden">
          <Shield className="w-16 h-16 opacity-10 absolute -right-2 -bottom-2 rotate-12" />
          <CardContent className="p-6">
            <p className="text-sm opacity-80 uppercase font-bold tracking-widest">Active Members</p>
            <h3 className="text-3xl font-bold mt-2">{activeCount}</h3>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <Calendar className="w-16 h-16 opacity-5 absolute -right-2 -bottom-2 rotate-12 text-primary" />
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Historical Roster</p>
            <h3 className="text-3xl font-bold mt-2 text-primary">{users.length}</h3>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <History className="w-16 h-16 opacity-5 absolute -right-2 -bottom-2 rotate-12 text-accent" />
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Inactive Accounts</p>
            <h3 className="text-3xl font-bold mt-2 text-accent">{inactiveCount}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                className="pl-9 bg-muted/30 border-none shadow-none focus-visible:ring-1 focus-visible:ring-accent" 
                placeholder="Search team members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Team Member</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Role</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Lifecycle</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={cn(
                  "hover:bg-accent/5 transition-colors group",
                  user.status === 'inactive' && "opacity-60 bg-muted/10"
                )}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-accent/10 text-accent font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary group-hover:text-accent transition-colors">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] uppercase font-bold px-2 py-0 border-none",
                        user.status === 'active' ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5 border-none",
                        getRoleBadgeStyles(user.role)
                      )}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Joined: {user.startDate || 'N/A'}
                      </div>
                      {user.lastDay && (
                        <div className="flex items-center gap-1.5 text-[10px] text-destructive/80">
                          <History className="w-3 h-3" />
                          Ended: {user.lastDay}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMember(user)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className={cn(user.status === 'active' ? "text-destructive" : "text-green-600")}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === 'active' ? "Deactivate Account" : "Reactivate Account"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                    No team members found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TeamMemberDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMember}
        user={editingUser}
      />

      <QuotaDialog 
        isOpen={isQuotaDialogOpen}
        onClose={() => setIsQuotaDialogOpen(false)}
        onSave={handleSaveQuotas}
        currentQuotas={quotas}
      />
    </div>
  );
}
