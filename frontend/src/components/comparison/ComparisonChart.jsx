import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ComparisonChart({
  firstAudit,
  secondAudit,
}) {
  const data = [
    {
      category: "Performance",
      auditA: firstAudit.scores.performance,
      auditB: secondAudit.scores.performance,
    },
    {
      category: "Accessibility",
      auditA: firstAudit.scores.accessibility,
      auditB: secondAudit.scores.accessibility,
    },
    {
      category: "Best Practices",
      auditA: firstAudit.scores.bestPractices,
      auditB: secondAudit.scores.bestPractices,
    },
    {
      category: "SEO",
      auditA: firstAudit.scores.seo,
      auditB: secondAudit.scores.seo,
    },
  ];

  const overallDifference =
    firstAudit.overallScore -
    secondAudit.overallScore;

  const differencePositive =
    overallDifference >= 0;

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#181827]">
            Score Comparison
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare category scores between the selected audits.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            differencePositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {differencePositive ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )}

          {differencePositive ? "+" : ""}
          {overallDifference} overall
        </div>
      </div>

      <div className="mt-7 h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
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
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
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
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="auditA"
              name="Audit A"
              fill="#7c3aed"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="auditB"
              name="Audit B"
              fill="#db2777"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 12-7 7-7-7" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default ComparisonChart;