import {
  ArrowRight,
  GitCompareArrows,
} from "lucide-react";

function ComparisonSelector({
  audits = [],
  firstAuditId,
  secondAuditId,
  onFirstChange,
  onSecondChange,
}) {
  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
          <GitCompareArrows size={19} />
        </div>

        <div>
          <h2 className="text-base font-bold text-[#181827]">
            Select Audits
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            Choose two audits to compare their scores and
            metrics.
          </p>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* First audit */}
        <div>
          <label
            htmlFor="first-audit"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400"
          >
            Audit A
          </label>

          <select
            id="first-audit"
            value={firstAuditId}
            onChange={(event) =>
              onFirstChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
          >
            <option value="" disabled>
              Select an audit
            </option>

            {audits.map((audit) => (
              <option
                key={audit.id}
                value={audit.id}
                disabled={
                  String(audit.id) ===
                  String(secondAuditId)
                }
              >
                {audit.website} — {audit.date} —{" "}
                {audit.device}
              </option>
            ))}
          </select>
        </div>

        {/* VS */}
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#eeeafd] bg-[#faf9ff] text-gray-400">
          <ArrowRight
            size={15}
            className="hidden lg:block"
          />

          <span className="text-[10px] font-bold lg:hidden">
            VS
          </span>
        </div>

        {/* Second audit */}
        <div>
          <label
            htmlFor="second-audit"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400"
          >
            Audit B
          </label>

          <select
            id="second-audit"
            value={secondAuditId}
            onChange={(event) =>
              onSecondChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
          >
            <option value="" disabled>
              Select an audit
            </option>

            {audits.map((audit) => (
              <option
                key={audit.id}
                value={audit.id}
                disabled={
                  String(audit.id) ===
                  String(firstAuditId)
                }
              >
                {audit.website} — {audit.date} —{" "}
                {audit.device}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default ComparisonSelector;