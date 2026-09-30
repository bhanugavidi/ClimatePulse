"use client";

import { useEffect, useState } from "react";
import { getReports, CitizenReport } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, FileText, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchMyReports() {
      try {
        // Attempt to pass user_id filter to backend (if supported)
        const data = await getReports({ user_id: user?.id });
        
        // If backend ignored user_id filter (returns others' reports), filter locally
        const myReports = data.filter(r => r.user_id === user?.id);
        
        // If backend didn't return any user_id matching ours, they either don't exist
        // or the backend didn't return user_id properly.
        setReports(myReports);
      } catch (err) {
        console.error(err);
        setError("Unable to load pollution data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyReports();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Reports</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage and review your submitted citizen reports.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading your reports...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No pollution reports found.</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              You haven't submitted any environmental observations yet. Help your community by reporting pollution.
            </p>
            <button 
              onClick={() => router.push('/report')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Submit a Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {report.photo_url && (
                  <div className="h-48 w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                    <img src={report.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                        report.severity?.toLowerCase() === 'severe' ? 'bg-red-100 text-red-700' :
                        report.severity?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                        report.severity?.toLowerCase() === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {report.severity || "Pending Analysis"}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg capitalize">{report.ai_category || "Uncategorized"}</h3>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic">
                    "{report.description || "No description provided."}"
                  </p>

                  <div className="flex items-center justify-between text-xs font-medium border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-1 text-slate-500">
                      <span>Lat: {report.lat.toFixed(4)}</span>
                      <span>Lng: {report.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-slate-500">Status</span>
                      <span className="capitalize text-slate-900 font-semibold">{report.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
