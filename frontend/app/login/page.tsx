"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Leaf, User, ShieldAlert, ArrowRight } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "citizen";
  const router = useRouter();

  const isCitizen = role === "citizen";
  const roleTitle = isCitizen ? "Citizen" : "Administrator";
  const RoleIcon = isCitizen ? User : ShieldAlert;
  const themeColor = isCitizen ? "emerald" : "slate";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set local auth state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    window.dispatchEvent(new Event('auth-change'));
    
    toast.success(`Successfully logged in as ${roleTitle}`);
    if (isCitizen) {
      router.push("/report");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isCitizen ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
            <RoleIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {roleTitle} Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back to ClimatePulse.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${isCitizen ? 'focus:ring-emerald-600' : 'focus:ring-slate-900'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${isCitizen ? 'focus:ring-emerald-600' : 'focus:ring-slate-900'}`}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded border-slate-300 text-${themeColor}-600 focus:ring-${themeColor}-600`}
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm leading-6">
                <a href="#" className={`font-semibold text-${themeColor}-600 hover:text-${themeColor}-500`}>
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${isCitizen ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href={`/register?role=${role}`} className={`font-semibold leading-6 text-${themeColor}-600 hover:text-${themeColor}-500`}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
