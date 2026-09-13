import {
  ClipboardList,
  SearchX,
} from "lucide-react";

import AuditHistoryRow from "./AuditHistoryRow";

function AuditHistoryList({
  audits = [],
}) {
  if (audits.length === 0) {
    return (
      <section className="rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e8ff] text-[#7c3aed]">
            <SearchX size={25} />
          </div>

          <h2 className="mt-5 text-base font-bold text-[#181827]">
            No audits found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Try changing your search or filters to find
            previous audits.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
      {/* Desktop Header */}
      <div className="hidden border-b border-[#eeeafd] bg-[#faf9ff] px-4 py-3 md:grid md:grid-cols-[minmax(0,1.7fr)_80px_100px_100px_110px_64px] md:items-center md:gap-3 lg:px-6 lg:grid-cols-[minmax(0,1.7fr)_100px_120px_120px_120px_80px] lg:gap-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Website
        </p>

        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Score
        </p>

        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Status
        </p>

        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Device
        </p>

        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Date
        </p>

        <p className="text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">
          Action
        </p>
      </div>

      {/* Rows */}
      <div>
        {audits.map((audit) => (
          <AuditHistoryRow
            key={audit.id}
            audit={audit}
          />
        ))}
      </div>

      {/* Count */}
      <div className="border-t border-[#eeeafd] bg-[#faf9ff] px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ClipboardList size={14} />

          <span>
            Showing {audits.length} audit
            {audits.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </section>
  );
}

export default AuditHistoryList;