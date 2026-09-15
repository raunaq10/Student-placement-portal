import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api, { assetUrl } from "../../services/api";
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Calendar,
  MessageSquare,
  Filter,
  ArrowLeft,
} from "lucide-react";

const STAGES = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

const ManageApplicants = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states for feedback / interview date
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        if (res.data.success) {
          setJobs(res.data.jobs);
          if (!selectedJobId && res.data.jobs.length > 0) {
            setSelectedJobId(res.data.jobs[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      if (res.data.success) {
        setApplicants(res.data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (app, targetStatus) => {
    setActiveApp(app);
    setNewStatus(targetStatus);
    setFeedback(app.feedback || "");
    setInterviewDate(app.interviewDate ? app.interviewDate.split("T")[0] : "");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setUpdating(true);
    try {
      const res = await api.put(`/applications/${activeApp._id}/status`, {
        status: newStatus,
        feedback,
        interviewDate: newStatus === "Interview" && interviewDate ? interviewDate : undefined,
      });

      if (res.data.success) {
        setMsg(`Applicant status successfully updated to ${newStatus}`);
        setActiveApp(null);
        fetchApplicants(selectedJobId);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applicants.filter((app) => {
    if (statusFilter === "All") return true;
    return app.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Interview":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidate Pipeline & Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted student profiles, verify resumes, and transition applicants across hiring rounds.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-500" />
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.companyId?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg("")} className="text-emerald-600 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["All", ...STAGES].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === st
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {st}{" "}
            <span className="opacity-70 text-[10px]">
              ({st === "All" ? applicants.length : applicants.filter((a) => a.status === st).length})
            </span>
          </button>
        ))}
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            Loading candidates...
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Candidate Details</th>
                  <th className="px-6 py-3.5">Academic Record</th>
                  <th className="px-6 py-3.5">Resume</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Hiring Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Candidate Details */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{app.studentId?.name}</div>
                      <div className="text-[11px] text-slate-500">{app.studentId?.email}</div>
                      <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                        Roll: {app.studentProfile?.rollNumber || "N/A"}
                      </div>
                    </td>

                    {/* Academic Record */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        CGPA: <strong className="text-indigo-700">{app.studentProfile?.cgpa ?? "N/A"}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {app.studentProfile?.branch}
                      </div>
                      <div className="text-[11px] text-rose-600">
                        Backlogs: {app.studentProfile?.backlogs ?? 0}
                      </div>
                    </td>

                    {/* Resume */}
                    <td className="px-6 py-4">
                      {app.resume?.url ? (
                        <a
                          href={assetUrl(app.resume.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                        >
                          <Download className="w-3 h-3" /> View Resume
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">No file</span>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Current Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => openUpdateModal(app, e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">
            No applicants found for this filter.
          </div>
        )}
      </div>

      {/* Status Update & Feedback Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Update Candidate Status:{" "}
              <span className="text-indigo-600 font-bold">{newStatus}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Candidate: <strong>{activeApp.studentId?.name}</strong> (
              {activeApp.studentProfile?.rollNumber})
            </p>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              {newStatus === "Interview" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Interview Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recruiter Feedback / Notes
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Excellent coding demonstration; recommended for final managerial round..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Save Status & Notify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplicants;
