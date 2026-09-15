import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Briefcase,
  Calendar,
  IndianRupee,
  Clock,
  Trash2,
  CheckCircle2,
  Users,
  Plus,
} from "lucide-react";

const ManageDrives = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs?status=");
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to load drives:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "Active" ? "Closed" : "Active";
    try {
      const res = await api.put(`/jobs/${job._id}`, { status: newStatus });
      if (res.data.success) {
        setMsg(`Drive status changed to ${newStatus}`);
        fetchJobs();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;
    try {
      const res = await api.delete(`/jobs/${id}`);
      if (res.data.success) {
        setMsg("Drive deleted.");
        fetchJobs();
      }
    } catch (err) {
      alert("Failed to delete drive");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Campus Placement Drives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise all active and completed corporate recruitment drives and candidate applications.
          </p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Drive
        </Link>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg("")} className="text-emerald-600 font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            Loading placement drives...
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Company & Role</th>
                  <th className="px-6 py-3.5">Package</th>
                  <th className="px-6 py-3.5">Criteria</th>
                  <th className="px-6 py-3.5">Key Dates</th>
                  <th className="px-6 py-3.5">Drive Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{j.title}</div>
                      <div className="text-[11px] text-indigo-600 font-semibold">
                        {j.companyId?.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{j.location}</div>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-emerald-600">{j.salary}</td>

                    <td className="px-6 py-4 text-[11px] text-slate-600">
                      <div>Min CGPA: <strong>{j.minimumCGPA}</strong></div>
                      <div>Max Backlogs: <strong>{j.maxBacklogs}</strong></div>
                    </td>

                    <td className="px-6 py-4 text-[11px] text-slate-600">
                      <div>
                        Deadline:{" "}
                        <strong>
                          {j.deadline ? new Date(j.deadline).toLocaleDateString("en-IN") : "Open"}
                        </strong>
                      </div>
                      {j.driveDate && (
                        <div className="text-indigo-600 font-semibold">
                          Drive: {new Date(j.driveDate).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(j)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          j.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {j.status} (Click to toggle)
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/recruiter/applicants?jobId=${j._id}`}
                          className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Applicants
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(j._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete drive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">No drives found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageDrives;
