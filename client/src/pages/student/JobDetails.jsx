import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EligibilityBadge from "../../components/EligibilityBadge";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Send,
  ExternalLink,
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.job);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError("");

    try {
      const res = await api.post(`/applications/${id}`);
      if (res.data.success) {
        setSuccessMsg("Application submitted successfully!");
        setShowApplyModal(false);
        fetchJob();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-slate-500">Job not found.</p>
        <Link to="/student/jobs" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          ← Back to drives
        </Link>
      </div>
    );
  }

  const isEligible = job.eligibility ? job.eligibility.isEligible : true;
  const hasApplied = !!job.application;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/student/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Placement Drives
      </Link>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <Link
            to="/student/applications"
            className="text-xs font-bold text-emerald-900 underline"
          >
            Track in My Applications →
          </Link>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
              {job.companyId?.name}
            </span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {job.salary}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline:{" "}
              {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Open"}
            </span>
            {job.driveDate && (
              <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                Drive Date: {new Date(job.driveDate).toLocaleDateString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {user?.role === "student" && (
            <>
              {hasApplied ? (
                <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Application Submitted
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">
                    Status: <strong>{job.application.status}</strong>
                  </div>
                </div>
              ) : isEligible ? (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
                >
                  <Send className="w-4 h-4" /> Apply for Drive
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-3.5 text-xs font-bold text-slate-400 bg-slate-100 rounded-2xl cursor-not-allowed border border-slate-200"
                >
                  Not Eligible to Apply
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid: Job Description & Eligibility Comparison */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Job Details & Company Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Role Overview & Responsibilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900">Required Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Background */}
          {job.companyId && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">{job.companyId.name}</h3>
                </div>
                {job.companyId.website && (
                  <a
                    href={job.companyId.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.companyId.description || "Corporate campus recruitment partner."}
              </p>
            </div>
          )}
        </div>

        {/* Right: Automated Eligibility Verification Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Eligibility System</h3>
              {job.eligibility && <EligibilityBadge eligibility={job.eligibility} size="sm" />}
            </div>

            <p className="text-xs text-slate-500">
              Your profile is checked in real-time against the company's placement requirements.
            </p>

            {job.eligibility?.checklist && (
              <div className="space-y-2 pt-1">
                {job.eligibility.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      item.passed
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-rose-50/50 border-rose-200"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{item.criteria}</div>
                      <div className="text-[11px] text-slate-500">Req: {item.required}</div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div className="text-[11px] font-bold text-slate-900">
                        {item.studentValue ?? "N/A"}
                      </div>
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isEligible && job.eligibility?.reasons && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-xs font-bold text-rose-800 mb-1">Ineligibility Reasons:</div>
                <ul className="text-[11px] text-rose-700 list-disc pl-4 space-y-1">
                  {job.eligibility.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Submit Application</h3>
                <p className="text-xs text-slate-500">{job.title} • {job.companyId?.name}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-600">
              <p>Your application will be submitted to the corporate recruitment team with:</p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <strong className="text-slate-900">{user?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll Number:</span>
                  <strong className="text-slate-900">{profile?.rollNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch & CGPA:</span>
                  <strong className="text-slate-900">{profile?.branch} ({profile?.cgpa})</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Attached Resume:
                  </span>
                  <strong className="text-indigo-700 underline truncate max-w-[180px]">
                    {profile?.resume?.originalName || "Student_Resume.pdf"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
