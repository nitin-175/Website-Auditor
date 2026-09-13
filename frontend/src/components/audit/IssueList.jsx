import IssueCard from "./IssueCard";

function IssueList({ issues = [] }) {
  const normalizedIssues = issues.map((issue) => ({
    ...issue,
    severity: String(issue.severity || "LOW").toUpperCase(),
  }));

  const critical = normalizedIssues.filter(
    (issue) => issue.severity === "CRITICAL"
  );

  const high = normalizedIssues.filter(
    (issue) => issue.severity === "HIGH"
  );

  const medium = normalizedIssues.filter(
    (issue) => issue.severity === "MEDIUM"
  );

  const low = normalizedIssues.filter(
    (issue) => issue.severity === "LOW"
  );

  const groups = [
    {
      label: "Critical Priority",
      severity: "critical",
      items: critical,
    },
    {
      label: "High Priority",
      severity: "high",
      items: high,
    },
    {
      label: "Medium Priority",
      severity: "medium",
      items: medium,
    },
    {
      label: "Low Priority",
      severity: "low",
      items: low,
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#181827]">
          Issues Found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Review the issues identified during the audit.
        </p>
      </div>

      <div className="space-y-5">
        {groups.map((group) => {
          if (group.items.length === 0) {
            return null;
          }

          return (
            <div
              key={group.severity}
              className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-[#181827]">
                  {group.label}
                </h3>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                  {group.items.length}
                </span>
              </div>

              <div className="space-y-3">
                {group.items.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {issues.length === 0 && (
        <div className="rounded-2xl border border-[#eeeafd] bg-white p-6 text-sm text-gray-500">
          No issues were found during this audit.
        </div>
      )}
    </section>
  );
}

export default IssueList;