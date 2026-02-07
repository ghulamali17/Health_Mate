import React from "react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  secondaryIconClassName = "text-cta",
  trend,
  trendClassName = "text-cta font-semibold",
  iconBgClassName = "bg-primary/10 dark:bg-primary/20",
  iconColorClassName = "text-primary dark:text-blue-400",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBgClassName} rounded-lg flex items-center justify-center`}
        >
          {Icon && <Icon className={`w-6 h-6 ${iconColorClassName}`} />}
        </div>
        {SecondaryIcon && (
          <SecondaryIcon className={`w-5 h-5 ${secondaryIconClassName}`} />
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <span className={`text-xs ${trendClassName}`}>{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
