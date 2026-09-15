import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StatusStepper from "../../components/StatusStepper";
import {
  FileCheck,
  Briefcase,
  Calendar,
  Clock,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/my");
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "In Progress") return ["Applied", "Under Review"].includes(app.status);
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Placement Applications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the live status of your campus drive applications from submission to selection.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["All", "In Progress", "Shortlisted", "Interview", "Selected", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === tab
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading your applications...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {app.jobId?.companyId?.name || "Company"}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600">
                      {app.jobId?.salary}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                    {app.jobId?.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {app.resume?.url && (
                    <a
                      href={app.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Attached Resume
                    </a>
                  )}
                  <Link
                    to={`/student/jobs/${app.jobId?._id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    View Drive
                  </Link>
                </div>
              </div>

              {/* Status Stepper Pipeline */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <StatusStepper currentStatus={app.status} />
              </div>

              {/* Interview Alert if scheduled */}
              {app.status === "Interview" && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-indigo-900">
                    <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <div>
                      <strong className="block">Placement Interview Scheduled:</strong>
                      <span>
                        {app.interviewDate
                          ? new Date(app.interviewDate).toLocaleDateString("en-IN", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Time to be confirmed via email"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recruiter Feedback Note */}
              {app.feedback && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                  <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Recruiter Feedback / Notes:</span>
                    <p className="text-slate-600 mt-0.5">{app.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <FileCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No applications found</h3>
          <p className="text-xs text-slate-400 mb-4">
            You haven't applied for any jobs matching this filter yet.
          </p>
          <Link
            to="/student/jobs"
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
          >
            Explore Active Drives
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
