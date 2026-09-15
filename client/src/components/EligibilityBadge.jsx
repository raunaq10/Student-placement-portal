import React, { useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const EligibilityBadge = ({ eligibility, size = "md" }) => {
  const [showModal, setShowModal] = useState(false);

  if (!eligibility) return null;

  const { isEligible, reasons = [], checklist = [] } = eligibility;

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
    lg: "text-sm px-4 py-2",
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className={`inline-flex items-center gap-1.5 font-bold rounded-full border transition-all shadow-sm ${
          sizeClasses[size] || sizeClasses.md
        } ${
          isEligible
            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
            : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
        }`}
        title="Click to view criteria comparison breakdown"
      >
        {isEligible ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible</span>
          </>
        ) : (
          <>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Not Eligible</span>
          </>
        )}
        <Info className="w-3 h-3 opacity-60 hover:opacity-100 ml-0.5" />
      </button>

      {/* Criteria Breakdown Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isEligible ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {isEligible ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Eligibility Breakdown</h3>
                  <p className="text-xs text-slate-500">Automated campus criteria verification</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist Table */}
            <div className="mt-4 space-y-2.5">
              {checklist && checklist.length > 0 ? (
                checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      item.passed
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/50 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div>
                      <span className="font-semibold block text-slate-800">{item.criteria}</span>
                      <span className="text-[11px] text-slate-500">
                        Required: <strong className="text-slate-700">{item.required}</strong>
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <div className="text-[11px]">
                        <span className="text-slate-500 block">Your Profile:</span>
                        <span className="font-bold text-slate-900">{item.studentValue ?? "N/A"}</span>
                      </div>
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No criteria details available.</p>
              )}
            </div>

            {/* Reasons / Action Guidance */}
            {reasons && reasons.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="text-xs font-bold text-amber-900 mb-1">Items to resolve:</div>
                <ul className="text-[11px] text-amber-800 space-y-1 list-disc pl-4">
                  {reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EligibilityBadge;
