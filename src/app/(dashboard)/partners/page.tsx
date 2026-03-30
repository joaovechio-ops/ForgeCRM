"use client";

import { useState, useEffect } from "react";
import { MOCK_PARTNERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Mail, Building2, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PartnersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Partner Ecosystem</h2>
          <p className="text-muted-foreground mt-1">Manage partner relationships and co-selling opportunities.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Register Partner
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <Building2 className="w-8 h-8 opacity-20 absolute right-6 top-6" />
            <p className="text-sm opacity-80 uppercase font-bold">Total Partners</p>
            <h3 className="text-3xl font-bold mt-2">12</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground uppercase font-bold">Partner-Led Rev</p>
            <h3 className="text-3xl font-bold mt-2 text-primary">$420k</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground uppercase font-bold">Active Co-Ops</p>
            <h3 className="text-3xl font-bold mt-2 text-accent">8</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 bg-muted/30 border-none shadow-none" placeholder="Search partners..." />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Partner Company</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Main Contact</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest">Type</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PARTNERS.map((partner) => (
                <TableRow key={partner.id} className="hover:bg-accent/5 transition-colors group">
                  <TableCell className="font-bold text-primary">{partner.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {partner.contactName}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {partner.contactEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5">
                      {partner.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-accent font-bold">VIEW PIPELINE</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
