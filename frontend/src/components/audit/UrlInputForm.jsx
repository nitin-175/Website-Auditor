import { Globe2, ShieldCheck } from "lucide-react";

function UrlInputForm({
  value,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor="audit-url"
        className="mb-2 block text-sm font-semibold text-[#181827]"
      >
        Website URL
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-[#e5e1f2] bg-white px-4 transition focus-within:border-[#8b5cf6] focus-within:ring-4 focus-within:ring-[#8b5cf6]/10">
        <Globe2
          size={19}
          className="shrink-0 text-[#8b5cf6]"
        />

        <input
          id="audit-url"
          type="url"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="https://example.com"
          className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-[#181827] outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck
          size={13}
          className="text-emerald-500"
        />

        <span>
          Enter a publicly accessible website URL.
        </span>
      </div>
    </div>
  );
}

export default UrlInputForm;