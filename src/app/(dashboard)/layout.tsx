
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Sidebar } from "@/components/crm/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Flame } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else {
        // Double-check active status on every layout mount/auth change
        const validateUser = async () => {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists() || !userDoc.data().isActive) {
            router.push('/login');
          } else {
            setIsValidated(true);
          }
        };
        validateUser();
      }
    }
  }, [user, isUserLoading, router, db]);

  if (isUserLoading || (!user && !isValidated) || (user && !isValidated)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Flame className="w-12 h-12 text-primary fill-primary" />
          <span className="text-primary font-bold uppercase text-xs tracking-widest">Securing Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar />
        <SidebarInset className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
