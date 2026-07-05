"use client";

import { Header } from "@/components/dashboard/header";
import { useAuth } from "@/hooks/use-auth";
import { PageTransition } from "@/components/shared/page-transition";
import { FullPageLoader } from "@/components/shared/loading-spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background/50 relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] rounded-full bg-pink-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vh] rounded-full bg-rose-500/5 blur-[120px]" />
      </div>

      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
