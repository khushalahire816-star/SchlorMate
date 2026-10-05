import { useState } from "react";

function PieChart({
  data = [],
  title,
  subtitle,
  size = 220,
}) {
  const [activeItem, setActiveItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No chart data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  if (total === 0) return null;

  const center = size / 2;
  const radius = size * 0.42;

  // Compute angles for each segment
  let cumulativeAngle = -Math.PI / 2; // start at 12 o'clock

  const slices = data.map((item) => {
    const fraction = item.value / total;
    const angle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    // SVG path command for pie wedge
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const percentage = Math.round(fraction * 100);

    return {
      ...item,
      percentage,
      pathData,
    };
  });

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
              {activeItem.value} ({activeItem.percentage}%)
            </span>
          </div>
        ) : (
          <span className="text-slate-400">Hover over slices to see percentage breakdown</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Pie */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice, index) => {
              const isHovered = activeItem?.label === slice.label;
              return (
                <path
                  key={slice.label || index}
                  d={slice.pathData}
                  fill={slice.color || "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: activeItem && !isHovered ? 0.65 : 1,
                    transformOrigin: `${center}px ${center}px`,
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                    filter: isHovered ? "drop-shadow(0 4px 6px rgba(0,0,0,0.12))" : "none",
                  }}
                  onMouseEnter={() => setActiveItem(slice)}
                  onMouseLeave={() => setActiveItem(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-[140px] text-xs">
          {slices.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${
                activeItem?.label === item.label ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
              }`}
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700">{item.label}</span>
              </div>
              <span className="text-slate-500 font-medium ml-3">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PieChart;
