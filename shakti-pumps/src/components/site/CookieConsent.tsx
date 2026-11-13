"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const COOKIE = "sp_consent";
const OPEN_EVENT = "sp-consent-open";
type Choice = "accepted" | "rejected";

function readChoice(): Choice | null {
  const m = document.cookie.match(/(?:^|;\s*)sp_consent=(accepted|rejected)/);
  return m ? (m[1] as Choice) : null;
}

function writeChoice(c: Choice) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${c}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax${secure}`;
}

/** Best-effort removal of Google Analytics cookies when a visitor withdraws consent. */
function clearAnalytics(gaId: string | null) {
  if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
  const host = location.hostname;
  const parts = host.split(".");
  const domains = [host, `.${host}`, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : ""].filter(Boolean);
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${d}`;
      document.cookie = `${name}=; Max-Age=0; Path=/`;
    }
  }
}

/** Reopen the banner (used by the footer "Cookie settings" link). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie Settings
    </button>
  );
}

export function CookieConsent({ gaId }: { gaId?: string }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [show, setShow] = useState(false);
  const id = gaId && /^[\w-]+$/.test(gaId) ? gaId : null;

  useEffect(() => {
    const c = readChoice();
    setChoice(c);
    setShow(c === null);
    setReady(true);
    const open = () => setShow(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  function decide(c: Choice) {
    writeChoice(c);
    setChoice(c);
    setShow(false);
    if (c === "rejected") clearAnalytics(id);
  }

  return (
    <>
      {/* Analytics is loaded ONLY after the visitor accepts. */}
      {ready && choice === "accepted" && id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {show && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-[4.5rem] z-[60] rounded-md border border-line bg-white p-5 shadow-lg md:inset-x-auto md:bottom-5 md:left-5 md:max-w-md"
        >
          <p className="text-sm font-semibold text-brand-950">We value your privacy</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We use cookies to understand how this website is used and to improve it. Analytics cookies are set only if you accept.{" "}
            <Link href="/privacy-policy" className="font-medium text-brand-700 underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => decide("accepted")} className="btn btn-primary flex-1 !py-2.5">
              Accept
            </button>
            <button type="button" onClick={() => decide("rejected")} className="btn btn-outline flex-1 !py-2.5">
              Reject
            </button>
          </div>
        </div>
      )}
    </>
  );
}
