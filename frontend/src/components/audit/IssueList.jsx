import IssueCard from "./IssueCard";

function IssueList({ issues = [] }) {
  const normalizedIssues = issues.map((issue) => ({
    ...issue,
    severity: String(issue.severity || "LOW").toUpperCase(),
  }));

  const groups = [
    {
      label: "Critical Priority",
      severity: "critical",
      items: normalizedIssues.filter(
        (issue) => issue.severity === "CRITICAL"
      ),
      countClass: "bg-[#fff0ed] text-[#d65347]",
    },
    {
      label: "High Priority",
      severity: "high",
      items: normalizedIssues.filter(
        (issue) => issue.severity === "HIGH"
      ),
      countClass: "bg-[#fff0ed] text-[#d65347]",
    },
    {
      label: "Medium Priority",
      severity: "medium",
      items: normalizedIssues.filter(
        (issue) => issue.severity === "MEDIUM"
      ),
      countClass: "bg-[#fff6df] text-[#a07819]",
    },
    {
      label: "Low Priority",
      severity: "low",
      items: normalizedIssues.filter(
        (issue) => issue.severity === "LOW"
      ),
      countClass: "bg-[#e9f8f5] text-[#168f82]",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#e05e51]">
          Findings
        </p>

        <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172033]">
          Issues Found
        </h2>

        <p className="mt-1 text-sm text-[#77766f]">
          Review the issues identified during the audit, starting with the
          highest priority.
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => {
          if (group.items.length === 0) {
            return null;
          }

          return (
            <div
              key={group.severity}
              className="overflow-hidden rounded-3xl border border-[#dedbd1] bg-white shadow-[0_10px_30px_rgba(23,32,51,0.03)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#e5e2d9] px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-sm font-extrabold text-[#172033]">
                    {group.label}
                  </h3>

                  <p className="mt-0.5 text-xs text-[#96948c]">
                    {group.items.length === 1
                      ? "1 finding"
                      : `${group.items.length} findings`}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${group.countClass}`}
                >
                  {group.items.length}
                </span>
              </div>

              <div className="divide-y divide-[#e8e5dc]">
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
        <div className="rounded-3xl border border-[#c9e8e3] bg-[#f3fbf9] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f8f5] text-[#168f82]">
            ✓
          </div>

          <h3 className="mt-4 text-base font-extrabold text-[#172033]">
            No issues found
          </h3>

          <p className="mt-1 text-sm text-[#66736f]">
            This audit did not identify any issues requiring attention.
          </p>
        </div>
      )}
    </section>
  );
}

export default IssueList;