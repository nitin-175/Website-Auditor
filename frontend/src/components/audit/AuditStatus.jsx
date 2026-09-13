import { AlertCircle, Clock3, X } from "lucide-react";
import Button from "../common/Button";

function AuditStatus({
  state,
  onCancel,
}) {
  if (state === "idle") {
    return null;
  }

  if (state === "failed") {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <div>
            <p className="text-sm font-semibold text-red-700">
              Audit failed
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              We couldn't complete the audit. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#eeeafd] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#7c3aed]">
          <Clock3 size={17} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#181827]">
            Audit in progress
          </p>

          <p className="mt-0.5 text-xs text-gray-400">
            This may take a few moments.
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="small"
        onClick={onCancel}
      >
        <X size={14} />
        Cancel
      </Button>
    </div>
  );
}

export default AuditStatus;