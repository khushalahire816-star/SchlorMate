import { useState } from "react";

function BarChart({
  data = [],
  title,
  subtitle,
  height = 220,
  valuePrefix = "",
  valueSuffix = "",
}) {
  const [activeItem, setActiveItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 160;
  const barWidth = 36;
  const gap = 20;
  const totalWidth = data.length * (barWidth + gap) + 40;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Relative Tooltip Display */}
      <div className="h-6 mb-2 flex items-center justify-between text-xs">
        {activeItem ? (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-sm font-medium animate-fadeIn">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeItem.color || "#2563eb" }}></span>
            <span>{activeItem.label}:</span>
            <span className="font-bold text-blue-300">
              {valuePrefix}{activeItem.value}{valueSuffix}
            </span>
            {activeItem.subtext && <span className="text-slate-400">({activeItem.subtext})</span>}
          </div>
        ) : (
          <span className="text-slate-400">Hover over bars for detailed insights</span>
        )}
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${totalWidth} ${chartHeight + 40}`}
          className="w-full min-w-[280px]"
          style={{ height: `${height}px` }}
        >
          {/* Subtle grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = chartHeight - pct * (chartHeight - 20) + 10;
            return (
              <g key={i}>
                <line
                  x1="20"
                  y1={y}
                  x2={totalWidth - 20}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const x = 30 + index * (barWidth + gap);
            const barH = Math.max(((item.value / maxValue) * (chartHeight - 20)), 6);
            const y = chartHeight - barH + 10;
            const isHovered = activeItem?.label === item.label;
            const barColor = item.color || "#2563eb";

            return (
              <g
                key={item.label || index}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Background hover pillar */}
                <rect
                  x={x - 6}
                  y={10}
                  width={barWidth + 12}
                  height={chartHeight}
                  fill={isHovered ? "#f8fafc" : "transparent"}
                  rx="6"
                />

                {/* Actual Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill={barColor}
                  className="transition-all duration-300"
                  style={{
                    filter: isHovered ? "drop-shadow(0 4px 6px rgba(37,99,235,0.25))" : "none",
                    transformOrigin: `${x + barWidth / 2}px ${chartHeight + 10}px`,
                    transform: isHovered ? "scaleY(1.03)" : "scaleY(1)",
                  }}
                />

                {/* Top value */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={isHovered ? "#1e293b" : "#64748b"}
                  fontSize="11"
                  fontWeight={isHovered ? "700" : "500"}
                  className="transition-colors"
                >
                  {item.value}
                </text>

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  fill={isHovered ? "#0f172a" : "#64748b"}
                  fontSize="11"
                  fontWeight={isHovered ? "600" : "400"}
                  className="transition-colors"
                >
                  {item.shortLabel || item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default BarChart;
