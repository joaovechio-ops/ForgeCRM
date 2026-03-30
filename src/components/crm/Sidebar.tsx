
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Activity as ActivityIcon, 
  LogOut,
  Target,
  Handshake,
  Package,
  Users,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Target },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "Partners", href: "/partners", icon: Handshake },
  { name: "Services", href: "/services", icon: Package },
  { name: "Activities", href: "/activities", icon: ActivityIcon },
  { name: "Team", href: "/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const auth = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <SidebarUI collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center w-full p-1">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0 shadow-lg shadow-primary/20">
                <Flame className="size-6 fill-current" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left leading-tight ml-3 overflow-hidden">
                    <span className="truncate font-headline font-extrabold text-xl text-sidebar-primary tracking-tighter">
                      FORGE<span className="text-secondary">CRM</span>
                    </span>
                  </div>
                  <div className="ml-auto">
                    <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
                  </div>
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all font-medium",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 px-2 py-2 transition-all",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-9 w-9 border-2 border-sidebar-primary/50 shrink-0 shadow-sm">
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/crm-user/200"} />
            <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-sidebar-foreground">{user?.displayName || "User"}</span>
              <span className="text-[10px] uppercase font-bold text-sidebar-foreground/50 tracking-tighter">Active Session</span>
            </div>
          )}
        </div>
        
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium text-sidebar-foreground/70"
              tooltip="Sign Out"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
}
