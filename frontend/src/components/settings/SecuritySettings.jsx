import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";

function SecuritySettings() {
  const securityItems = [
    {
      title: "Password Protection",
      description:
        "Your account password is protected by the application's secure password hashing system.",
    },
    {
      title: "Authenticated Sessions",
      description:
        "Your audit data is accessible only through an authenticated account session.",
    },
    {
      title: "Account Verification",
      description:
        "Email verification is part of the account authentication flow.",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#dedbd1] bg-white shadow-sm">
      <div className="border-b border-[#dedbd1] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf9f7] text-[#138f82]">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#172033]">
              Security
            </h2>

            <p className="mt-1 text-xs text-[#8a8881]">
              Review the security protections available on your account.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#dedbd1]">
        {securityItems.map((item, index) => (
          <div
            key={item.title}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f6f0] text-[#65645f]">
                {index === 0 ? (
                  <LockKeyhole size={17} />
                ) : (
                  <ShieldCheck size={17} />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  {item.title}
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-[#8a8881]">
                  {item.description}
                </p>
              </div>
            </div>

            <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#edf9f7] px-2.5 py-1 text-[11px] font-semibold text-[#138f82]">
              <CheckCircle2 size={12} />
              Active
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SecuritySettings;