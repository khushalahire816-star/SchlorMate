import { useState } from "react";

function DonutChart({
  value = 85,
  maxValue = 100,
  title,
  subtitle,
  centerLabel = "Profile Completion",
  centerValue,
  size = 200,
  strokeWidth = 18,
  primaryColor = "#2563eb",
  trackColor = "#e2e8f0",
  segments = null, // Optional multi-segment support
}) {
  const [activeSegment, setActiveSegment] = useState(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Single-value metric mode (e.g. 85%)
  if (!segments) {
    const percentage = Math.min(Math.round((value / maxValue) * 100), 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="w-full flex flex-col items-center">
        {(title || subtitle) && (
          <div className="w-full mb-3 text-left">
            {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        )}

        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={trackColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Value Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={primaryColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Central content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {centerValue !== undefined ? centerValue : `${percentage}%`}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 max-w-[110px] leading-tight">
              {centerLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Multi-segment mode
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
  let accumulatedOffset = 0;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="w-full mb-3 text-left">
          {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={trackColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {segments.map((seg, idx) => {
              const segPct = (seg.value / total) * 100;
              const segLength = (segPct / 100) * circumference;
              const offset = accumulatedOffset;
              accumulatedOffset += segLength;
              const isHovered = activeSegment?.label === seg.label;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={seg.color || primaryColor}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${segLength} ${circumference - segLength}`}
                  strokeDashoffset={-offset}
                  fill="transparent"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setActiveSegment(seg)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Central content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeSegment ? activeSegment.value : (centerValue !== undefined ? centerValue : `${value}%`)}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 max-w-[100px] leading-tight">
              {activeSegment ? activeSegment.label : centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-[130px] text-xs">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${
                activeSegment?.label === seg.label ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
              }`}
              onMouseEnter={() => setActiveSegment(seg)}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-700">{seg.label}</span>
              </div>
              <span className="text-slate-500 font-medium ml-2">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DonutChart;
