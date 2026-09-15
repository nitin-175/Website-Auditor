import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ScoreTrendChart({ audits = [] }) {
  const completedAudits = [...audits]
    .filter(
      (audit) =>
        audit.status?.toUpperCase() === "COMPLETED" &&
        audit.overallScore !== null &&
        audit.overallScore !== undefined,
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    );

  const realData = completedAudits.slice(-8).map((audit) => ({
    date: formatDate(audit.createdAt),
    score: Math.round(Number(audit.overallScore)),
  }));

  const demoData = [
    { date: "Preview 1", score: 68 },
    { date: "Preview 2", score: 72 },
    { date: "Preview 3", score: 70 },
    { date: "Preview 4", score: 77 },
    { date: "Preview 5", score: 75 },
    { date: "Preview 6", score: 82 },
    { date: "Preview 7", score: 84 },
  ];

  const data = realData.length > 0 ? realData : demoData;
  const isDemo = realData.length === 0;

  const latestScore = realData.at(-1)?.score;
  const previousScore =
    realData.length > 1 ? realData.at(-2)?.score : null;

  const movement =
    latestScore !== undefined && previousScore !== null
      ? latestScore - previousScore
      : null;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#ddd9ce] bg-white shadow-[0_8px_30px_rgba(23,32,51,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#e5e2d9] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4f46e5]" />
            <h2 className="text-base font-extrabold text-[#172033]">
              Score trend
            </h2>
          </div>

          <p className="mt-1.5 text-xs leading-5 text-[#8b8981]">
            {isDemo
              ? "A preview of how your score history will look."
              : "Your most recent completed audit scores."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {movement !== null && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                movement >= 0
                  ? "bg-[#e8f7f4] text-[#128f82]"
                  : "bg-[#fff0ed] text-[#d95b4f]"
              }`}
            >
              {movement >= 0 ? "+" : ""}
              {movement} latest
            </span>
          )}

          <span className="rounded-full bg-[#f2f0e9] px-2.5 py-1 text-[11px] font-bold text-[#6f6d66]">
            {isDemo ? "Preview" : `${realData.length} audits`}
          </span>
        </div>
      </div>

      <div className="px-3 pb-5 pt-5 sm:px-5 sm:pb-6">
        <div className="h-[275px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 12,
                right: 12,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="#e8e5dc"
                strokeDasharray="3 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#96948c",
                }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#96948c",
                }}
                ticks={[0, 25, 50, 75, 100]}
              />

              <Tooltip
                cursor={{
                  stroke: "#d8d5cc",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  border: "1px solid #ddd9ce",
                  borderRadius: "12px",
                  background: "#ffffff",
                  boxShadow: "0 10px 30px rgba(23,32,51,0.08)",
                }}
                labelStyle={{
                  color: "#172033",
                  fontSize: 12,
                  fontWeight: 700,
                }}
                formatter={(value) => [`${value}/100`, "Score"]}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                strokeDasharray={isDemo ? "7 5" : undefined}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#4f46e5",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#4f46e5",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {isDemo && (
          <div className="mt-2 rounded-xl border border-dashed border-[#dcd8ce] bg-[#faf9f4] px-4 py-3">
            <p className="text-xs leading-5 text-[#85837b]">
              Run an audit to replace this preview with your real score
              history.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ScoreTrendChart;