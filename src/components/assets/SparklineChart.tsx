interface SparklineChartProps {
  data: number[];
  uid: string;
}

export function SparklineChart({ data, uid }: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? "#22c55e" : "#ef4444";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 120;
  const height = 40;
  const padding = 2;

  const points = data.map((price, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M ${padding},${height - padding} L ${points.join(" L ")} L ${width - padding},${height - padding} Z`;

  const gradientId = `sg-${uid}-${isUp ? "up" : "dn"}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
