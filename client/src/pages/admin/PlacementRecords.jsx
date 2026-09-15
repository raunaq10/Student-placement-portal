import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Download, Award, Search, FileCheck, CheckCircle2, Building2 } from "lucide-react";

const PlacementRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard/records");
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error("Failed to load placement records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleExportCSV = () => {
    if (!records || records.length === 0) {
      alert("No placement records to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Email",
      "Roll Number",
      "Branch",
      "CGPA",
      "Company Name",
      "Job Title",
      "Package",
      "Package (LPA)",
      "Placed Date",
    ];

    const rows = records.map((r) => [
      `"${r.studentName}"`,
      `"${r.studentEmail}"`,
      `"${r.rollNumber}"`,
      `"${r.branch}"`,
      `"${r.cgpa}"`,
      `"${r.companyName}"`,
      `"${r.jobTitle}"`,
      `"${r.package}"`,
      `"${r.packageLPA}"`,
      `"${r.placedAt ? new Date(r.placedAt).toLocaleDateString("en-IN") : "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Campus_Placement_Records_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Official Placement Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete institutional archive of confirmed campus placements and recruitment packages.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={records.length === 0}
          className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Download Official CSV Report
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by student name, roll number, hiring company, branch..."
          className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            Loading placement records...
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Candidate Details</th>
                  <th className="px-6 py-3.5">Roll Number</th>
                  <th className="px-6 py-3.5">Branch & CGPA</th>
                  <th className="px-6 py-3.5">Hiring Company & Role</th>
                  <th className="px-6 py-3.5">CTC Package</th>
                  <th className="px-6 py-3.5 text-right">Placement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{r.studentName}</div>
                      <div className="text-[11px] text-slate-500">{r.studentEmail}</div>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-800">{r.rollNumber}</td>

                    <td className="px-6 py-4">
                      <div className="text-slate-800">{r.branch}</div>
                      <div className="text-[11px] text-indigo-700 font-bold">CGPA: {r.cgpa}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{r.companyName}</div>
                      <div className="text-[11px] text-slate-500">{r.jobTitle}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.package}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {r.placedAt ? new Date(r.placedAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">
            No confirmed placement records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementRecords;
