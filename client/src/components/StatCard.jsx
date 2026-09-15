import React from "react";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "indigo", trend }) => {
  const colorSchemes = {
    indigo: {
      iconBg: "bg-indigo-50 text-indigo-600",
      accent: "border-indigo-500",
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-500",
    },
    blue: {
      iconBg: "bg-blue-50 text-blue-600",
      accent: "border-blue-500",
    },
    purple: {
      iconBg: "bg-purple-50 text-purple-600",
      accent: "border-purple-500",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600",
      accent: "border-amber-500",
    },
    rose: {
      iconBg: "bg-rose-50 text-rose-600",
      accent: "border-rose-500",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
