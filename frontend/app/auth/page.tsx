"use client";

import Link from "next/link";
import { User, ShieldAlert, ArrowRight } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-6">
      <div className="max-w-4xl w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to ClimatePulse
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Select your role to continue to the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Citizen Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow flex flex-col items-start relative group">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <User className="h-6 w-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Citizen</h2>
            <p className="text-slate-600 mb-8 flex-1">
              Report local pollution events, view live air quality maps, and receive early warnings for your neighborhood.
            </p>
            <div className="w-full space-y-3 mt-auto">
              <Link 
                href="/login?role=citizen"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
              >
                Login as Citizen <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/register?role=citizen"
                className="w-full flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Register New Account
              </Link>
            </div>
          </div>

          {/* Administrator Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow flex flex-col items-start relative group">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <ShieldAlert className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Administrator</h2>
            <p className="text-slate-600 mb-8 flex-1">
              Access the authority dashboard to monitor active hotspots, review citizen reports, and coordinate response efforts.
            </p>
            <div className="w-full space-y-3 mt-auto">
              <Link 
                href="/login?role=admin"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                Login as Administrator <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="w-full text-center pt-2">
                <span className="text-xs text-slate-500">
                  Need an agency account? <a href="#" className="font-semibold underline hover:text-slate-700">Contact Us</a>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
