"use client";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent } from "@FC237/ui/components/card";
import { ArrowRight, Bot, BrainCircuit, CheckCircle2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ProjectLogo } from "@/components/project-logo";
import { FC237_PRODUCT_TAGLINE } from "@/lib/branding";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <ProjectLogo className="max-w-[280px]" />
              <div className="mt-1 text-xs text-muted-foreground">{FC237_PRODUCT_TAGLINE}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link className={buttonVariants({ variant: "ghost" })} href={"/docs" as Route}>
              Docs
            </Link>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Start Readiness Assessment</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link className={buttonVariants()} href={"/dashboard" as Route}>
                Open dashboard
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Show>
          </div>
        </header>
        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1fr_520px]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/88 px-3.5 py-2 text-sm font-medium text-foreground/84 shadow-sm">
              <BrainCircuit className="text-primary dark:text-foreground" />
              Guided AI and cloud governance for SMEs
            </div>
            <h1 className="text-5xl font-semibold tracking-normal text-foreground lg:text-6xl">
              FC237 turns compliance from a blank start into a guided improvement journey.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Start with the readiness questionnaire, review the dashboard, build inventory, treat risks, implement controls, collect evidence, measure maturity, and generate report-ready compliance output from one command center.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg">
                    Start Readiness Assessment
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline">
                    Sign in
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link className={buttonVariants({ size: "lg" })} href={"/dashboard" as Route}>
                  Go to dashboard
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Show>
            </div>
          </div>
          <Card className="rounded-[2rem] border-0 bg-card/90 shadow-[0_28px_60px_-44px_rgba(15,23,42,0.28)] ring-1 ring-border/70 dark:shadow-[0_28px_60px_-40px_rgba(0,0,0,0.72)]">
            <CardContent className="grid gap-4 p-6">
              {[
                ["Questionnaire-first start", "New users begin with the initial readiness questionnaire instead of landing on an empty dashboard."],
                ["Executive command center", "Review the overall score, domain signals, urgent risks, evidence coverage, and next actions in one place."],
                ["Inventory to evidence workflow", "Move from cloud and AI inventory into risk, controls, vendor review, evidence, maturity, and reporting."],
                ["Guided assistant support", "Use OpenAI or Gemini guidance grounded in live FC237 records and Cameroon-aware governance instructions."],
              ].map(([title, body]) => (
                <div className="grid grid-cols-[32px_1fr] gap-3" key={title}>
                  <CheckCircle2 className="text-primary dark:text-foreground" />
                  <div>
                    <h2 className="font-medium">{title}</h2>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 rounded-[1.5rem] border border-border/70 bg-muted/35 p-5 text-foreground shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Bot className="text-primary dark:text-foreground" />
                  FC237 Assistant
                </div>
                <p className="mt-3 text-sm/6 text-muted-foreground">
                  Ask about MFA, vendor reviews, incident response, AI systems, evidence, and maturity improvement with advice tailored to Cameroonian compliance and governance realities.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
