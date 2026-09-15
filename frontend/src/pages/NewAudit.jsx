import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  Check,
  Gauge,
  Globe2,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import UrlInputForm from "../components/audit/UrlInputForm";
import DeviceToggle from "../components/audit/DeviceToggle";
import AuditButton from "../components/audit/AuditButton";
import AuditProgress from "../components/audit/AuditProgress";
import AuditStatus from "../components/audit/AuditStatus";
import auditService from "../services/auditService";
import authService from "../services/authService";

function NewAudit() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("desktop");
  const [auditState, setAuditState] = useState("idle");
  const [error, setError] = useState("");

  const storedUser = authService.getStoredUser();
  const userName = storedUser?.name || "User";

  const handleStartAudit = async () => {
    if (!url.trim()) {
      return;
    }

    try {
      setError("");
      setAuditState("running");

      const result = await auditService.createAudit({
        url: url.trim(),
        device,
      });

      console.log("Audit completed:", result);

      if (!result?.id) {
        throw new Error(
          "Audit completed but no audit ID was returned."
        );
      }

      navigate(`/app/report/${result.id}`);
    } catch (error) {
      console.error("Audit failed:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to complete the audit. Please try again."
      );

      setAuditState("idle");
    }
  };

  const handleCancelAudit = () => {
    setAuditState("idle");
    setError("");
  };

  const auditChecks = [
    {
      icon: Gauge,
      title: "Performance",
      description: "Speed and loading experience",
      tone: "indigo",
    },
    {
      icon: Accessibility,
      title: "Accessibility",
      description: "Usability for every visitor",
      tone: "teal",
    },
    {
      icon: SearchCheck,
      title: "SEO",
      description: "Search visibility essentials",
      tone: "amber",
    },
    {
      icon: ShieldCheck,
      title: "Best Practices",
      description: "Technical quality and safety",
      tone: "coral",
    },
  ];

  const toneStyles = {
    indigo: "bg-[#eef0ff] text-[#4f46e5]",
    teal: "bg-[#e9f8f5] text-[#168f82]",
    amber: "bg-[#fff6df] text-[#a07819]",
    coral: "bg-[#fff0ed] text-[#d65347]",
  };

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <section className="text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#dedbd1] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#4f46e5] shadow-sm">
            <Globe2 size={13} />
            Website audit
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-[#172033] sm:text-4xl">
            Audit a new website
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#77766f] sm:text-base">
            Enter a website URL and get a clear picture of its performance,
            accessibility, SEO and technical quality.
          </p>
        </section>

        {/* Idle state */}
        {auditState === "idle" && (
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            {/* Audit form */}
            <section className="rounded-3xl border border-[#dedbd1] bg-white shadow-[0_14px_40px_rgba(23,32,51,0.05)]">
              <div className="border-b border-[#e5e2d9] px-5 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
                    <Zap size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-[#172033]">
                      Start your audit
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#96948c]">
                      It only takes a URL to get started.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-5 sm:p-7">
                <UrlInputForm
                  value={url}
                  onChange={setUrl}
                />

                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-extrabold text-[#172033]">
                      Choose a device
                    </h3>

                    <p className="mt-1 text-xs text-[#96948c]">
                      Test the experience visitors get on this device.
                    </p>
                  </div>

                  <DeviceToggle
                    value={device}
                    onChange={setDevice}
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-[#f1c7c2] bg-[#fff8f6] px-4 py-3.5">
                    <p className="text-sm font-semibold text-[#c84438]">
                      {error}
                    </p>
                  </div>
                )}

                <div className="border-t border-[#e5e2d9] pt-6">
                  <AuditButton
                    disabled={!url.trim()}
                    onClick={handleStartAudit}
                  />
                </div>
              </div>
            </section>

            {/* What we check */}
            <aside className="rounded-3xl border border-[#dedbd1] bg-[#fbfaf5] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#19a999]">
                    What we check
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-[#172033]">
                    One audit. Four areas.
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#19a999] shadow-sm">
                  <Check size={19} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {auditChecks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-[#e4e1d8] bg-white p-3.5"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[item.tone]}`}
                      >
                        <Icon size={17} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-[#172033]">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-[#96948c]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-[#c9e8e3] bg-[#f3fbf9] p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-[#168f82]">
                    <Smartphone size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#172033]">
                      Mobile and desktop ready
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5f716e]">
                      Run the same website through either device profile to
                      understand where the experience differs.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Running state */}
        {auditState === "running" && (
          <div className="mx-auto max-w-4xl space-y-5">
            <div className="rounded-3xl border border-[#dedbd1] bg-white p-5 shadow-[0_14px_40px_rgba(23,32,51,0.05)] sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f46e5]">
                    Analysis running
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172033]">
                    Auditing your website
                  </h2>

                  <p className="mt-1 break-all text-xs text-[#96948c]">
                    {url}
                  </p>
                </div>

                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5] sm:flex">
                  <ArrowRight size={19} />
                </div>
              </div>

              <AuditProgress
                url={url}
                device={device}
              />
            </div>

            <AuditStatus
              state={auditState}
              onCancel={handleCancelAudit}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default NewAudit;