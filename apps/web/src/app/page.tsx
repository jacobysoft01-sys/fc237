"use client";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent } from "@FC237/ui/components/card";
import { ArrowRight, Bot, BrainCircuit, CheckCircle2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ProjectLogo } from "@/components/project-logo";
import { FC237_PRODUCT_TAGLINE, FC237_WORKFLOW_SEQUENCE } from "@/lib/branding";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <ProjectLogo className="max-w-[150px]" />
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary shadow-sm">
              <BrainCircuit />
              Guided AI and cloud governance for SMEs
            </div>
            <h1 className="text-5xl font-semibold tracking-normal text-foreground lg:text-6xl">
              FC237 turns compliance from a blank start into a guided improvement journey.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Start with the readiness questionnaire, review the dashboard, build inventory, treat risks, implement controls, collect evidence, measure maturity, and generate report-ready compliance output from one command center.
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-background/70 px-4 py-4 text-sm text-muted-foreground shadow-sm">
              <span className="font-medium text-foreground">FC237 workflow:</span> {FC237_WORKFLOW_SEQUENCE}
            </div>
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
          <Card className="rounded-[2rem] border-0 bg-background/88 shadow-xl ring-1 ring-border/70">
            <CardContent className="grid gap-4 p-6">
              {[
                ["Questionnaire-first start", "New users begin with the initial readiness questionnaire instead of landing on an empty dashboard."],
                ["Executive command center", "Review the overall score, domain signals, urgent risks, evidence coverage, and next actions in one place."],
                ["Inventory to evidence workflow", "Move from cloud and AI inventory into risk, controls, vendor review, evidence, maturity, and reporting."],
                ["Guided assistant support", "Use OpenAI or Gemini guidance grounded in live FC237 records and Cameroon-aware governance instructions."],
              ].map(([title, body]) => (
                <div className="grid grid-cols-[32px_1fr] gap-3" key={title}>
                  <CheckCircle2 className="text-primary" />
                  <div>
                    <h2 className="font-medium">{title}</h2>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 rounded-[1.5rem] bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Bot />
                  FC237 Assistant
                </div>
                <p className="mt-3 text-sm/6 opacity-90">
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
