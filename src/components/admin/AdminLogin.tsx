"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { signIn, type ActionResult } from "@/lib/admin/actions";
import { loginSchema } from "@/lib/admin/schemas";
import { siteConfig } from "@/lib/siteConfig";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const data = new FormData();
    data.set("password", values.password);
    const outcome = await signIn(null, data);
    setResult(outcome);
  });

  return (
    <div className="grid min-h-full place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          {siteConfig.wordmark.lead}
          <span className="text-blue-600 dark:text-blue-400">
            {siteConfig.wordmark.accent}
          </span>
        </div>

        <h1 className="mt-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          <Lock className="size-5" aria-hidden />
          Admin sign-in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Internal tooling for updating prices and tax slabs. {siteConfig.owner}.
        </p>

        {!configured ? (
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Admin access is not configured. Set <code>ADMIN_PASSWORD</code> and{" "}
              <code>ADMIN_SESSION_SECRET</code> in your environment, then restart
              the server.
            </span>
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              disabled={!configured}
              {...form.register("password")}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-offset-2 focus-visible:outline-2 focus-visible:outline-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus-visible:outline-white"
            />
          </label>

          <button
            type="submit"
            disabled={form.formState.isSubmitting || !configured}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <KeyRound className="size-4" aria-hidden />
            {form.formState.isSubmitting ? "Checking…" : "Sign in"}
          </button>
        </form>

        {result && !result.ok ? (
          <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">
            {result.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
