"use client";

import { useState, useEffect } from "react";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-primary font-bold">Loading Services...</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Service Repository</h2>
          <p className="text-muted-foreground mt-1">Catalog of consulting, implementation, and SaaS services.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </header>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 bg-muted/30 border-none shadow-none focus-visible:ring-1 focus-visible:ring-accent" placeholder="Search services..." />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Service Name</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Unit</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Base Price</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Cost</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Margin</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SERVICES.map((service) => {
                const margin = ((service.basePrice - service.cost) / service.basePrice) * 100;
                return (
                  <TableRow key={service.id} className="hover:bg-accent/5 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{service.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{service.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/20 border-muted">
                        {service.unit}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.basePrice.toLocaleString()} {service.currency}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.cost.toLocaleString()} {service.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold text-green-700 bg-green-50 border-none">
                        {margin.toFixed(0)}% MARGIN
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-accent font-bold hover:bg-accent/10">EDIT</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
