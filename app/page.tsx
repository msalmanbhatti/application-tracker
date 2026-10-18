import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-layout";

const FEATURES = [
  {
    title: "Everything in one place",
    text: "Save the company, role and job link for every application you send.",
  },
  {
    title: "Know where you stand",
    text: "Move applications from Wishlist to Offer and always see what's next.",
  },
  {
    title: "Private by default",
    text: "Row-level security means only you can ever see your applications.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <SiteHeader />

      <section className="flex-1 w-full max-w-5xl flex flex-col items-center text-center gap-6 px-5 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          Keep track of every internship application
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Stop losing applications in spreadsheets and inboxes. Applyd keeps
          your whole job search organized in one simple board.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/protected">Go to my applications</Link>
          </Button>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3 w-full mt-12 text-left">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-lg border p-5">
              <h2 className="font-semibold mb-1">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}