import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: number[];
}

export function SparklineChart({ data }: SparklineChartProps) {
  if (data.length < 2) return null;

  const points = data.map((price) => ({ price }));
  const isUp = data[data.length - 1] >= data[0];

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={isUp ? "#22c55e" : "#ef4444"}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
