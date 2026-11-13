"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Login failed.");
    setBusy(false);
  }

  return (
    // <main className="grid min-h-screen place-items-center px-4">
    //   <form onSubmit={onSubmit} className="card w-full max-w-sm p-8">
    //     <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-950">Shakti Pumps</p>
    //     <h1 className="mt-1 text-2xl font-semibold text-brand-950">Admin sign in</h1>
    //     <div className="mt-6 space-y-4">
    //       <div>
    //         <label className="label" htmlFor="email">Email</label>
    //         <input id="email" name="email" type="email" required autoComplete="username" className="input" />
    //       </div>
    //       <div>
    //         <label className="label" htmlFor="password">Password</label>
    //         <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
    //       </div>
    //     </div>
    //     {error && <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    //     <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full py-3">{busy ? "Signing in…" : "Sign in"}</button>
    //   </form>
    // </main>
      <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          {/* Top Brand Accent Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 to-brand-400" />

          <form onSubmit={onSubmit} className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-600">
                Shakti Pumps
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Admin Sign In
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Enter your credentials to access the management portal.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800"
              >
                <span className="mt-0.5 rounded-full bg-red-200 p-0.5 text-red-600">
                  ⚠️
                </span>
                <p className="flex-1 leading-snug">{error}</p>
              </div>
            )}

            {/* Inputs Container */}
            <div className="mt-6 space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="admin@shaktipumps.com"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by Shakti Pumps internal authentication.
        </p>
      </div>
    </main>
  );
}
