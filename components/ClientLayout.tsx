"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation } from "framer-motion";
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));
import dynamic from "next/dynamic";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { ContextualActionBar } from "@/components/ui/ContextualActionBar";
import { useContextualActionBar } from "@/src/store/useContextualActionBar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const isBarVisible = useContextualActionBar((s) => s.visible);

  return (
    <LazyMotion features={domAnimation}>
      <ToastProvider>
        <FeedbackModal />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-[280px] min-w-0">
            <Header />
            <div className={`flex-1 md:pb-0 ${isBarVisible ? 'pb-[136px]' : 'pb-[72px]'}`}>
              {children}
            </div>
            <Footer />
            <ContextualActionBar />
            <BottomNav />
          </div>
        </div>
      </ToastProvider>
    </LazyMotion>
  );
}
