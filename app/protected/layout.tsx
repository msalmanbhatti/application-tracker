import { SiteHeader, SiteFooter } from "@/components/site-layout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <SiteHeader />
      <div className="flex-1 w-full max-w-3xl flex flex-col gap-8 p-5 py-12">
        {children}
      </div>
      <SiteFooter />
    </main>
  );
}