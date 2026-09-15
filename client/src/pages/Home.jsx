import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/jobs?status=Active"),
        ]);
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (jobsRes.data.success) {
          setFeaturedJobs(jobsRes.data.jobs.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Centralized Campus Recruitment System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Launch Your Career with the Official{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                Student Placement Portal
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              Empowering students, corporate recruiters, and the college placement cell with automated eligibility checking, one-click drive applications, verified resume management, and live recruitment pipeline analytics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <Link
                  to={
                    user.role === "student"
                      ? "/student/dashboard"
                      : user.role === "recruiter"
                      ? "/recruiter/dashboard"
                      : "/admin/dashboard"
                  }
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                >
                  Go to {user.role === "admin" ? "Admin" : user.role === "student" ? "Student" : "Recruiter"} Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                  >
                    Student Registration
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all"
                  >
                    Explore Demo Portals
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                {stats ? stats.placedStudentsCount : "180+"}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Placed Students
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {stats ? `${stats.placementRate}%` : "74%"}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Placement Rate
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">
                {stats ? `₹${stats.highestPackage} LPA` : "₹24 LPA"}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Highest Package
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                {stats ? `₹${stats.averagePackage} LPA` : "₹8.2 LPA"}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Average Package
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core System Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Every Campus Stakeholder
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A unified workflow connecting students, corporate recruiters, and the college placement administration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Maintain your academic credentials, projects, and resume. Real-time eligibility indicators tell you immediately if you qualify for campus drives.
            </p>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant automated eligibility status</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1-click application with verified resume</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Real-time status timeline tracking</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Recruiters</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Post job profiles with customizable eligibility criteria (CGPA, backlogs, branch). Filter verified student pools and move candidates through rounds.
            </p>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Define criteria thresholds & branches</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Inspect student resumes & academic scores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Multi-stage candidate shortlisting pipeline</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Placement Cell</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Replace messy spreadsheets with an executive command center. Monitor placement percentage, salary trends, and export records effortlessly.
            </p>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Executive placement statistics & graphs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Student roster & verification oversight</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>1-click CSV report export for college records</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Active Campus Drives Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Campus Placement Drives
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top corporate hiring partners currently conducting recruitment drives.
            </p>
          </div>
          <Link
            to="/student/jobs"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {job.companyId?.name || "Partner Company"}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">{job.salary}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mb-2">{job.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div>
                      Min CGPA: <strong className="text-slate-800">{job.minimumCGPA}</strong>
                    </div>
                    <div>
                      Location: <strong className="text-slate-800">{job.location}</strong>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/student/jobs/${job._id}`}
                  className="w-full py-2 text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  View Details & Eligibility
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Loading active placement drives...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
