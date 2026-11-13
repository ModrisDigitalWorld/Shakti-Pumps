import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-950">Page not found</h1>
        <p className="mt-3 text-muted">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/products" className="btn btn-outline">Browse products</Link>
        </div>
      </div>
    </main>
  );
}
