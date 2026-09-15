import React from "react";
import { Check, XCircle, Clock } from "lucide-react";

const STAGES = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected"];

const StatusStepper = ({ currentStatus }) => {
  const isRejected = currentStatus === "Rejected";

  const getStageIndex = (status) => {
    switch (status) {
      case "Applied":
        return 0;
      case "Under Review":
        return 1;
      case "Shortlisted":
        return 2;
      case "Interview":
        return 3;
      case "Selected":
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
        <XCircle className="w-4 h-4 text-rose-600" />
        <span>Application Status: Rejected / Closed</span>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Horizontal Connector Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : isCurrent
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-200 animate-pulse"
                    : "bg-white border-2 border-slate-300 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium tracking-tight text-center ${
                  isCurrent
                    ? "text-indigo-700 font-bold"
                    : isCompleted
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
