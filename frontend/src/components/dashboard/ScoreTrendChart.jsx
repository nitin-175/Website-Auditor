import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { date: "Aug 01", score: 76 },
  { date: "Aug 03", score: 79 },
  { date: "Aug 05", score: 78 },
  { date: "Aug 07", score: 83 },
  { date: "Aug 09", score: 81 },
  { date: "Aug 11", score: 86 },
  { date: "Aug 13", score: 87 },
];

function ScoreTrendChart() {
  return (
    <section className="min-w-0 rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#181827]">
            Score Trend
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Average audit score over time
          </p>
        </div>

        <span className="mt-2 w-fit rounded-full bg-[#f3e8ff] px-2.5 py-1 text-xs font-semibold text-[#7c3aed] sm:mt-0">
          Last 14 days
        </span>
      </div>

      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#eeeafd"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#9ca3af",
              }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#9ca3af",
              }}
            />

            <Tooltip
              contentStyle={{
                border: "1px solid #eeeafd",
                borderRadius: "10px",
                boxShadow:
                  "0 8px 24px rgba(124, 58, 237, 0.08)",
              }}
              labelStyle={{
                color: "#181827",
                fontWeight: 600,
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#7c3aed",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ScoreTrendChart;