import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-emerald-700">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ClimatePulse
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Home
            </Link>
            <Link href="/map" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Live Map
            </Link>
            <Link href="/report" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Report
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/cross-border" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Cross-Border
            </Link>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-500">
            AI-powered environmental intelligence for healthier cities.
          </p>
        </div>
      </div>
    </footer>
  );
}
