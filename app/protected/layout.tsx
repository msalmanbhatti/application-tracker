import { SiteHeader, SiteFooter } from "@/components/site-layout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-[1248px] flex-1 px-6 py-10">{children}</div>
      <SiteFooter />
    </main>
  );
}