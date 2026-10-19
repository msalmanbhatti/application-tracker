import Link from "next/link";
import { ArrowRight, Kanban, Lock, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-layout";
import { BoardPreview } from "@/components/board-preview";

const FEATURES = [
  {
    Icon: PanelLeft,
    title: "Everything in one place",
    text: "Save the company, role and job link for every application you send — in seconds.",
  },
  {
    Icon: Kanban,
    title: "Know where you stand",
    text: "Move applications from Wishlist to Offer and always see what's next at a glance.",
  },
  {
    Icon: Lock,
    title: "Private by default",
    text: "Row-level security means only you can ever see your applications. No sharing, no ads.",
  },
];

const STEPS = [
  {
    title: "Save the role",
    text: "Add the company, role and job link. Applyd keeps it on your board.",
  },
  {
    title: "Move it forward",
    text: "Drag cards from Wishlist to Applied to Interview as things progress.",
  },
  {
    title: "Land the offer",
    text: "See your whole pipeline at once and never lose track of where you applied.",
  },
];

// Small reusable pieces of text styling
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-[560px] font-display text-[clamp(1.9rem,3vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* 1. Hero */}
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-lime ring-2 ring-lime-soft" aria-hidden />
          Built for internship season
        </span>

        <h1 className="mt-6 max-w-[880px] font-display text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.03em]">
          Keep track of every internship application
        </h1>

        <p className="mt-6 max-w-[660px] text-[clamp(1.05rem,1.6vw,1.19rem)] leading-relaxed text-muted-foreground">
          Stop losing applications in spreadsheets and inboxes. Applyd keeps your
          whole search on one simple board — from saved link to signed offer.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-[52px] rounded-[10px] px-5 text-[15px]">
            <Link href="/auth/sign-up">
              Start tracking — it&apos;s free
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px] rounded-[10px] bg-card px-5 text-[15px]">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <p className="mt-6 text-[13px] text-muted-foreground">
          No credit card · Private by default · Drag-and-drop board
        </p>
      </section>

      {/* 2. Board preview */}
      <section className="mx-auto w-full max-w-[1248px] px-6 pb-24">
        <BoardPreview />
      </section>

      {/* 3. Features */}
      <section id="features" className="mx-auto w-full max-w-[1200px] px-6 py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Why Applyd</Eyebrow>
            <SectionTitle>Built for the messy middle of the job hunt</SectionTitle>
          </div>
          <p className="max-w-[400px] text-[15px] leading-relaxed text-muted-foreground">
            Applyd replaces the spreadsheet, the starred emails and the sticky
            notes with one board you&apos;ll actually keep up to date.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="rounded-[14px] border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-lime-soft text-lime-ink">
                <Icon size={18} aria-hidden />
              </span>
              <h3 className="mt-8 font-display text-[17px] font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. How it works */}
      <section id="how-it-works" className="mt-16 w-full border-y bg-card">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24">
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle>From saved link to signed offer</SectionTitle>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t-2 border-foreground pt-6">
                <span className="font-mono text-[11px] text-lime-ink dark:text-lime">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[22px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Call to action */}
      <section className="mx-auto w-full max-w-[1248px] px-6 py-24">
        <div className="flex flex-col justify-between gap-8 rounded-[20px] bg-foreground px-8 py-12 text-background sm:px-16 sm:py-16 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-[560px] font-display text-[clamp(1.9rem,3vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
              Your next offer starts with one saved link.
            </h2>
            <p className="mt-4 text-[15px] opacity-70">
              Set up your board in under a minute.
            </p>
          </div>
          <Link
            href="/auth/sign-up"
            className="inline-flex h-[52px] shrink-0 items-center gap-2 self-start rounded-[10px] bg-lime px-5 text-[15px] font-medium text-[#111110] hover:bg-lime/90 md:self-auto"
          >
            Create your board
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}