import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EligibilityBadge from "../../components/EligibilityBadge";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  IndianRupee,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const JobListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [minSalary, setMinSalary] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (branchFilter && branchFilter !== "All") params.append("branch", branchFilter);
      if (minSalary) params.append("minSalary", minSalary);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [branchFilter, minSalary]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Drives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse corporate recruitment drives and check your automated eligibility.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Disciplines</option>
            <option value="Computer Science and Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics and Communication">ECE</option>
          </select>

          <select
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Salary Package</option>
            <option value="6">₹6+ LPA</option>
            <option value="10">₹10+ LPA</option>
            <option value="15">₹15+ LPA</option>
            <option value="20">₹20+ LPA</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title, company name, required skills (e.g. Java, Python, Cloud)..."
          className="w-full pl-11 pr-28 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading placement drives...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Company & Salary */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                    {job.companyId?.name || "Company"}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {job.salary}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="font-extrabold text-base text-slate-900 mb-1">{job.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </p>

                {/* Eligibility Badge */}
                {user?.role === "student" && job.eligibility && (
                  <div className="mb-4">
                    <EligibilityBadge eligibility={job.eligibility} />
                  </div>
                )}

                {/* Criteria highlights */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min CGPA:</span>
                    <strong className="text-slate-800">{job.minimumCGPA}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Backlogs:</span>
                    <strong className="text-slate-800">{job.maxBacklogs}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deadline:</span>
                    <strong className="text-slate-800">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Ongoing"}
                    </strong>
                  </div>
                </div>

                {/* Skills Tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {job.hasApplied ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                  </span>
                ) : (
                  <div />
                )}

                <Link
                  to={`/student/jobs/${job._id}`}
                  className="px-4 py-2 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl transition-colors flex items-center gap-1 ml-auto"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No drives match your filters</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search criteria or resetting filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobListings;
