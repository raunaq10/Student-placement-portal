import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StatCard from "../../components/StatCard";
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  TrendingUp,
  Award,
  Download,
  BarChart3,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Placement Cell Administration
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Campus Placement Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics on university recruitment drives, student selections, and corporate packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/records"
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Placement CSV
          </Link>
          <Link
            to="/admin/drives"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Manage Drives
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          subtitle="Registered candidates"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Partner Companies"
          value={stats?.totalCompanies ?? 0}
          subtitle="Corporate recruiters"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Placement Rate"
          value={`${stats?.placementRate ?? 0}%`}
          subtitle={`${stats?.placedStudentsCount ?? 0} students placed`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Highest Package"
          value={`₹${stats?.highestPackage ?? 0} LPA`}
          subtitle={`Average: ₹${stats?.averagePackage ?? 0} LPA`}
          icon={Award}
          color="purple"
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active Drives</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats?.activeJobs ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Applications</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats?.totalApplications ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Shortlisted / Interviews</div>
          <div className="text-xl font-bold text-indigo-600 mt-1">{stats?.shortlistedCount ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Selected Candidates</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{stats?.placedStudentsCount ?? 0}</div>
        </div>
      </div>

      {/* Visual Analytics Grid: Branch-wise Stats & Pipeline Funnel */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branch-wise Placement Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Branch-wise Placement Performance
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Placed / Enrolled</span>
          </div>

          <div className="space-y-4 pt-1">
            {stats?.branchStats && stats.branchStats.length > 0 ? (
              stats.branchStats.map((b, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{b.branch}</span>
                    <span className="text-slate-600">
                      <strong>{b.placed}</strong> / {b.total} placed ({b.rate}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${b.rate}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">No branch data available.</div>
            )}
          </div>
        </div>

        {/* Application Pipeline Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Campus Hiring Funnel Distribution
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">All Drives</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Applied</div>
              <div className="text-xl font-extrabold text-slate-800 mt-1">
                {stats?.statusCounts?.Applied ?? 0}
              </div>
            </div>

            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-center">
              <div className="text-[11px] font-bold text-amber-700 uppercase">Under Review</div>
              <div className="text-xl font-extrabold text-amber-900 mt-1">
                {stats?.statusCounts?.UnderReview ?? 0}
              </div>
            </div>

            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 text-center">
              <div className="text-[11px] font-bold text-blue-700 uppercase">Shortlisted</div>
              <div className="text-xl font-extrabold text-blue-900 mt-1">
                {stats?.statusCounts?.Shortlisted ?? 0}
              </div>
            </div>

            <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200 text-center">
              <div className="text-[11px] font-bold text-indigo-700 uppercase">Interview</div>
              <div className="text-xl font-extrabold text-indigo-900 mt-1">
                {stats?.statusCounts?.Interview ?? 0}
              </div>
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 text-center">
              <div className="text-[11px] font-bold text-emerald-700 uppercase">Selected</div>
              <div className="text-xl font-extrabold text-emerald-900 mt-1">
                {stats?.statusCounts?.Selected ?? 0}
              </div>
            </div>

            <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 text-center">
              <div className="text-[11px] font-bold text-rose-700 uppercase">Rejected</div>
              <div className="text-xl font-extrabold text-rose-900 mt-1">
                {stats?.statusCounts?.Rejected ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Placement Selections Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Recent Campus Placements</h2>
          <Link
            to="/admin/records"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            All Placement Records ({stats?.placedStudentsCount ?? 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentPlacements && stats.recentPlacements.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.recentPlacements.map((p) => (
              <div key={p._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{p.studentId?.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {p.companyId?.name} • {p.jobId?.title}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600">{p.package}</span>
                  <div className="text-[10px] text-slate-400">
                    {new Date(p.placedAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">No placements recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
