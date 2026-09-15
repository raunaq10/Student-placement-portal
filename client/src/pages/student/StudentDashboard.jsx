import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  Briefcase,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusStepper from "../../components/StatusStepper";
import EligibilityBadge from "../../components/EligibilityBadge";

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [appRes, jobsRes, profRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/jobs?status=Active"),
          api.get("/profile/me"),
        ]);

        if (appRes.data.success) {
          setApplications(appRes.data.applications);
        }
        if (jobsRes.data.success) {
          setRecentJobs(jobsRes.data.jobs.slice(0, 4));
        }
        if (profRes.data.success && profRes.data.placement) {
          setPlacement(profRes.data.placement);
          // Trigger celebratory confetti if placed!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error("Failed to fetch student dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const shortlistedCount = applications.filter((a) =>
    ["Shortlisted", "Interview", "Selected"].includes(a.status)
  ).length;

  const interviews = applications.filter((a) => a.status === "Interview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Placed Celebration Banner */}
      {placement && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center sm:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Officially Placed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Congratulations, {user?.name}! 🎉
            </h2>
            <p className="text-sm text-emerald-100 max-w-xl">
              You have secured an offer with{" "}
              <strong className="text-white underline">
                {placement.companyId?.name || "Corporate Partner"}
              </strong>{" "}
              with a package of <strong className="text-yellow-300">{placement.package}</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 min-w-[180px] z-10">
            <Award className="w-8 h-8 mx-auto mb-1 text-yellow-300" />
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Placed Package
            </div>
            <div className="text-xl font-extrabold text-white">{placement.package}</div>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Student Placement Portal
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Roll: <strong className="text-slate-700">{profile?.rollNumber || "Not Set"}</strong> •{" "}
            Branch: <strong className="text-slate-700">{profile?.branch || "N/A"}</strong> • Current
            CGPA: <strong className="text-slate-700">{profile?.cgpa || "0"}</strong> • Backlogs:{" "}
            <strong className="text-slate-700">{profile?.backlogs ?? 0}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/jobs"
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" /> Browse Campus Drives
          </Link>
          <Link
            to="/student/profile"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Profile Completeness Alert if Resume Missing */}
      {(!profile?.resume || !profile.resume.url) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Placement Resume Missing!</h4>
              <p className="text-xs text-amber-700">
                You must upload your resume before companies can accept your drive applications.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Upload Resume
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Current CGPA"
          value={profile?.cgpa || "0.0"}
          subtitle={`${profile?.backlogs || 0} active backlogs`}
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Applied Drives"
          value={applications.length}
          subtitle="Submitted applications"
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="In Pipeline"
          value={shortlistedCount}
          subtitle="Shortlisted / Interviews"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Placement Status"
          value={placement ? "Placed" : "In Progress"}
          subtitle={placement ? placement.package : "Active candidate"}
          icon={Award}
          color={placement ? "emerald" : "amber"}
        />
      </div>

      {/* Upcoming Interviews Alert */}
      {interviews.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-bold text-indigo-950">
              Upcoming Placement Interviews ({interviews.length})
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {interviews.map((app) => (
              <div
                key={app._id}
                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {app.jobId?.companyId?.name || "Company"}
                  </div>
                  <div className="text-[11px] text-slate-500">{app.jobId?.title}</div>
                  <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                    Scheduled:{" "}
                    {app.interviewDate
                      ? new Date(app.interviewDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date to be announced"}
                  </div>
                </div>
                <Link
                  to="/student/applications"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Active Applications & Recent Drives */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Applications with Status Stepper */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recent Application Pipeline
            </h2>
            <Link
              to="/student/applications"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              All Applications ({applications.length})
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {app.jobId?.title || "Job Position"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {app.jobId?.companyId?.name} • {app.jobId?.salary}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {app.status}
                    </span>
                  </div>

                  <StatusStepper currentStatus={app.status} />

                  {app.feedback && (
                    <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong>Recruiter Note:</strong> {app.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              You have not applied for any placement drives yet.
              <div className="mt-2">
                <Link
                  to="/student/jobs"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Explore Campus Drives →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Live Placement Drives with Automated Eligibility */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Active Campus Drives
            </h2>
            <Link
              to="/student/jobs"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View All Drives →
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{job.title}</span>
                      <span className="text-[11px] font-semibold text-emerald-600">{job.salary}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {job.companyId?.name} • Min CGPA: {job.minimumCGPA}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <EligibilityBadge eligibility={job.eligibility} size="sm" />
                    <Link
                      to={`/student/jobs/${job._id}`}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No active drives available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
