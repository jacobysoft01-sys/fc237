"use client";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent } from "@FC237/ui/components/card";
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, Shield } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,oklch(0.95_0.04_286),transparent_34rem),linear-gradient(180deg,oklch(1_0_0),oklch(0.985_0.006_286))]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield />
            </div>
            <div>
              <div className="text-2xl font-semibold">FC237</div>
              <div className="text-xs text-muted-foreground">Compliance Assistant</div>
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
                <Button>Start assessment</Button>
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              <BrainCircuit />
              Hybrid AI and cloud governance for SMEs
            </div>
            <h1 className="text-5xl font-semibold tracking-normal text-foreground lg:text-6xl">
              FC237 turns cybersecurity governance into guided daily action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Assess cloud readiness, register AI systems, score risks, collect evidence, evaluate vendors, and generate compliance-ready reports from one executive command center.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg">
                    Create your account
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
          <Card className="rounded-lg border-0 bg-background/86 shadow-xl ring-1 ring-border">
            <CardContent className="grid gap-4 p-6">
              {[
                ["Executive command center", "Compliance score, evidence coverage, open findings, and high-risk AI systems."],
                ["Guided FC237 assistant", "Rule-based guidance with risk, action, evidence, next step, and escalation notices."],
                ["Evidence Vault", "Link screenshots, access reviews, policies, incident logs, and reports to controls."],
                ["Framework mapping", "Track FC237 progress against ISO 27001, NIST AI RMF, and EU AI Act."],
              ].map(([title, body]) => (
                <div className="grid grid-cols-[32px_1fr] gap-3" key={title}>
                  <CheckCircle2 className="text-primary" />
                  <div>
                    <h2 className="font-medium">{title}</h2>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 rounded-lg bg-primary p-5 text-primary-foreground">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Bot />
                  FC237 Assistant
                </div>
                <p className="mt-3 text-sm/6 opacity-90">
                  Ask about MFA, vendor reviews, incident response, AI systems, evidence, and maturity improvement without reading the framework manually.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
