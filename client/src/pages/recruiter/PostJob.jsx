import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Save,
  Plus,
} from "lucide-react";

const ALL_BRANCHES = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
];

const PostJob = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("₹8.0 LPA");
  const [packageLPA, setPackageLPA] = useState("8.0");
  const [location, setLocation] = useState("Bengaluru / Remote");
  const [minimumCGPA, setMinimumCGPA] = useState("7.0");
  const [minTenthPercentage, setMinTenthPercentage] = useState("65");
  const [minTwelfthPercentage, setMinTwelfthPercentage] = useState("65");
  const [maxBacklogs, setMaxBacklogs] = useState("0");
  const [selectedBranches, setSelectedBranches] = useState([
    "Computer Science and Engineering",
    "Information Technology",
  ]);
  const [skills, setSkills] = useState(["Java", "SQL", "Problem Solving"]);
  const [skillInput, setSkillInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [driveDate, setDriveDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies");
        if (res.data.success && res.data.companies.length > 0) {
          setCompanies(res.data.companies);
          setCompanyId(res.data.companies[0]._id);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    };

    fetchCompanies();

    // Default deadline to 30 days from today
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setDeadline(d.toISOString().split("T")[0]);

    const driveD = new Date();
    driveD.setDate(driveD.getDate() + 15);
    setDriveDate(driveD.toISOString().split("T")[0]);
  }, []);

  const handleBranchToggle = (b) => {
    if (selectedBranches.includes(b)) {
      setSelectedBranches(selectedBranches.filter((item) => item !== b));
    } else {
      setSelectedBranches([...selectedBranches, b]);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/jobs", {
        companyId,
        title,
        description,
        salary,
        packageLPA: Number(packageLPA),
        location,
        minimumCGPA: Number(minimumCGPA),
        minTenthPercentage: Number(minTenthPercentage),
        minTwelfthPercentage: Number(minTwelfthPercentage),
        maxBacklogs: Number(maxBacklogs),
        branches: selectedBranches.length === 0 ? ["All"] : selectedBranches,
        requiredSkills: skills,
        deadline,
        driveDate,
      });

      if (res.data.success) {
        setSuccess("Campus drive opening published successfully!");
        setTimeout(() => {
          navigate("/recruiter/dashboard");
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Post Campus Placement Drive
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Define job roles and eligibility criteria. Students are automatically evaluated against these rules.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Role Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Position & Corporate Partner
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recruiting Company
              </label>
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title / Designation
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Development Engineer (L3)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary Package (Display Format)
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹12.0 LPA"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CTC Package (Numeric in LPA for Analytics)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={packageLPA}
                onChange={(e) => setPackageLPA(e.target.value)}
                placeholder="12.0"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Hyderabad / Pan India"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Description & Key Responsibilities
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role responsibilities, team structure, and technologies used..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Automated Eligibility Criteria */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Automated Eligibility Thresholds
          </h2>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={minimumCGPA}
                onChange={(e) => setMinimumCGPA(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Max Backlogs Allowed
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Min 10th Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={minTenthPercentage}
                onChange={(e) => setMinTenthPercentage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Min 12th Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={minTwelfthPercentage}
                onChange={(e) => setMinTwelfthPercentage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Eligible Branches Checkbox Grid */}
          <div className="pt-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Eligible Engineering Branches
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {ALL_BRANCHES.map((b) => (
                <label
                  key={b}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(b)}
                    onChange={() => handleBranchToggle(b)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-800">{b}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Skills & Key Dates */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Required Skills & Schedule
          </h2>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Required Technical Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. Node.js, C++, System Design, SQL"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg flex items-center gap-1.5"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((item) => item !== s))}
                    className="hover:text-rose-600 text-indigo-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Placement Drive Date (Optional)
              </label>
              <input
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Publishing Drive..." : "Publish Placement Drive"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
