import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-[#060610]">
        <div className="orb orb-violet w-[500px] h-[500px] -top-40 right-0" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 -left-20" />

        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto relative z-10">
            <div className="p-6 max-w-[1440px] mx-auto">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
