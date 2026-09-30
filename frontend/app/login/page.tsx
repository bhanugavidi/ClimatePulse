"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, ShieldAlert, Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/report";
  const router = useRouter();

  const [roleTab, setRoleTab] = useState<"citizen" | "admin">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // If redirect is admin, default to admin tab
  useEffect(() => {
    if (redirect === "/admin") {
      setRoleTab("admin");
    }
  }, [redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp && roleTab === "citizen") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Account created successfully. Please check your email or proceed.");
        if (data.session) {
          router.push(redirect);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Successfully logged in.");
        
        // Let middleware or useAuth handle redirection if they try to access admin without rights
        const isAdmin = data.user?.user_metadata?.role === 'admin';
        
        if (roleTab === 'admin' && !isAdmin) {
          toast.error("This account does not have Admin privileges.");
          await supabase.auth.signOut();
          return;
        }

        if (isAdmin && redirect === '/report') {
            router.push("/admin");
        } else {
            router.push(redirect);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Role Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${roleTab === 'citizen' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRoleTab('citizen'); setIsSignUp(false); }}
          >
            Citizen
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${roleTab === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRoleTab('admin'); setIsSignUp(false); }}
          >
            Authority
          </button>
        </div>

        <div className="text-center mb-8">
          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${roleTab === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {roleTab === 'admin' ? <ShieldAlert className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {roleTab === 'admin' ? 'Sign in to the Authority Command Center' : 'Sign in to report pollution events.'}
          </p>
        </div>

        {roleTab === 'admin' && isSignUp ? (
          <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
            <Mail className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Admin Registration Restricted</h3>
            <p className="text-sm text-slate-600 mb-4">
              To request an Authority/Admin account for your agency, please contact us at:
            </p>
            <a href="mailto:bhanugavidi@gmail.com" className="font-bold text-blue-600 hover:text-blue-700 text-lg">
              bhanugavidi@gmail.com
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all text-sm text-slate-900"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all text-sm text-slate-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
                roleTab === 'admin' 
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600' 
                  : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900'
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-600 hover:text-emerald-500 font-semibold"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-64px)] items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
