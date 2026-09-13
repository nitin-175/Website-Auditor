import {
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

function SecuritySettings() {
  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
      <div className="border-b border-[#eeeafd] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#181827]">
              Security
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Review your account security settings.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#eeeafd]">
        {/* Password */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#faf9ff] text-gray-500">
              <LockKeyhole size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#181827]">
                Password
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            Protected
          </span>
        </div>

        {/* Login security */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#181827]">
                Login Security
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Your account uses authenticated sessions to protect
                access to your audit data.
              </p>
            </div>

            <div className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySettings;