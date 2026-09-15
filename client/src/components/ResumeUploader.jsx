import React, { useState } from "react";
import api, { assetUrl } from "../services/api";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Download, RefreshCw } from "lucide-react";

const ResumeUploader = ({ currentResume, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Check type
    const validExtensions = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validExtensions.includes(selected.type) && !selected.name.match(/\.(pdf|doc|docx)$/i)) {
      setError("Please select a valid PDF or DOC/DOCX file.");
      setFile(null);
      return;
    }

    // Check size (5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5 MB limit.");
      setFile(null);
      return;
    }

    setError("");
    setSuccess("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/profile/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccess("Resume uploaded successfully!");
        setFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(res.data.resume);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Placement Resume</h3>
          <p className="text-xs text-slate-500">
            This resume is automatically attached when you apply to campus job drives.
          </p>
        </div>
        {currentResume?.url && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resume Active
          </span>
        )}
      </div>

      {/* Current Resume Info */}
      {currentResume?.url && (
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {currentResume.originalName || "Student_Resume.pdf"}
              </div>
              <div className="text-[11px] text-slate-500">
                Uploaded on{" "}
                {currentResume.uploadedAt
                  ? new Date(currentResume.uploadedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently"}
              </div>
            </div>
          </div>

          <a
            href={assetUrl(currentResume.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> View / Download
          </a>
        </div>
      )}

      {/* Upload New Version Dropzone */}
      <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
        <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-800 mb-1">
          {file ? file.name : "Select or drag updated resume file here"}
        </p>
        <p className="text-[11px] text-slate-500 mb-3">Supported formats: PDF, DOC, DOCX (Max 5 MB)</p>

        <label className="inline-block cursor-pointer">
          <span className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors">
            {file ? "Change Selected File" : "Browse Files"}
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-200 transition-colors"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" /> Save & Attach Resume
                </>
              )}
            </button>
            <button
              onClick={() => setFile(null)}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
