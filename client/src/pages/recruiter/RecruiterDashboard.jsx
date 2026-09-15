import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const res = await api.get("/jobs");
        if (res.data.success) {
          setJobs(res.data.jobs);
          // Count total applicants across jobs
          const appPromises = res.data.jobs.map((j) =>
            api.get(`/applications/job/${j._id}`).catch(() => ({ data: { count: 0 } }))
          );
          const results = await Promise.all(appPromises);
          const sum = results.reduce((acc, curr) => acc + (curr.data.count || 0), 0);
          setTotalApplicants(sum);
        }
      } catch (err) {
        console.error("Failed to fetch recruiter data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Recruitment Command Center
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your campus job openings, review student applicants, and update hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Post New Opening
          </Link>
          <Link
            to="/recruiter/company"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Company Profile
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Drives"
          value={jobs.length}
          subtitle="Published openings"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Total Candidates"
          value={totalApplicants}
          subtitle="Applications received"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Hiring Pipeline"
          value="5 Stages"
          subtitle="Review to Selection"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Portal Status"
          value="Verified"
          subtitle="Campus Partner"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Active Jobs & Applicants Management */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Placement Drives</h2>
            <p className="text-xs text-slate-500">
              Select any position to review student candidates and modify recruitment stages.
            </p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> New Posting
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {job.salary}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {job.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>Company: {job.companyId?.name}</span>
                    <span>•</span>
                    <span>Min CGPA: {job.minimumCGPA}</span>
                    <span>•</span>
                    <span>Max Backlogs: {job.maxBacklogs}</span>
                    <span>•</span>
                    <span>
                      Deadline:{" "}
                      {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Open"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/recruiter/applicants?jobId=${job._id}`}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" /> Review Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No job openings posted yet.
            <div className="mt-2">
              <Link
                to="/recruiter/post-job"
                className="text-indigo-600 font-bold hover:underline"
              >
                Post your first campus drive →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
