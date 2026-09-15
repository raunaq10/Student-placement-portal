import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  X,
} from "lucide-react";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [minCGPA, setMinCGPA] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (branchFilter && branchFilter !== "All") params.append("branch", branchFilter);
      if (minCGPA) params.append("minCGPA", minCGPA);

      const res = await api.get(`/profile/all?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [branchFilter, minCGPA]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Roster & Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and inspect all registered students, verify CGPAs, and check placement statuses.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
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
            value={minCGPA}
            onChange={(e) => setMinCGPA(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any CGPA</option>
            <option value="7.0">7.0+ CGPA</option>
            <option value="8.0">8.0+ CGPA</option>
            <option value="9.0">9.0+ CGPA</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, email, roll number..."
          className="w-full pl-11 pr-28 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            Loading student records...
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Student Details</th>
                  <th className="px-6 py-3.5">Roll Number</th>
                  <th className="px-6 py-3.5">Branch / Course</th>
                  <th className="px-6 py-3.5">CGPA & Backlogs</th>
                  <th className="px-6 py-3.5">Placement Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{st.userId?.name}</div>
                      <div className="text-[11px] text-slate-500">{st.userId?.email}</div>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-800">{st.rollNumber}</td>

                    <td className="px-6 py-4">
                      <div className="text-slate-800">{st.branch}</div>
                      <div className="text-[11px] text-slate-400">
                        {st.course} • Sem {st.semester}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-extrabold text-indigo-700">{st.cgpa}</div>
                      <div className="text-[11px] text-rose-600">Backlogs: {st.backlogs ?? 0}</div>
                    </td>

                    <td className="px-6 py-4">
                      {st.isPlaced ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Placed:{" "}
                          {st.placementInfo?.package || "Offer"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">No students found.</div>
        )}
      </div>

      {/* Inspect Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {selectedStudent.userId?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.rollNumber} • {selectedStudent.branch}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic Snapshot */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">CGPA</span>
                <strong className="text-sm font-extrabold text-indigo-700">
                  {selectedStudent.cgpa}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">10th / 12th</span>
                <strong className="text-xs font-bold text-slate-800">
                  {selectedStudent.tenthPercentage}% / {selectedStudent.twelfthPercentage}%
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Backlogs</span>
                <strong className="text-xs font-bold text-rose-600">
                  {selectedStudent.backlogs ?? 0}
                </strong>
              </div>
            </div>

            {/* Skills */}
            {selectedStudent.skills && selectedStudent.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Button */}
            {selectedStudent.resume?.url && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-950">Placement Resume Attached</div>
                  <div className="text-[11px] text-indigo-700">
                    {selectedStudent.resume.originalName}
                  </div>
                </div>
                <a
                  href={selectedStudent.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
