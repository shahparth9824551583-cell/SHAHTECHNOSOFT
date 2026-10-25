import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="font-display text-7xl font-bold text-gold">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3"><Link href="/" className="btn-navy">Go Home</Link><Link href="/courses" className="btn-gold">Explore Courses</Link></div>
    </div>
  );
}
