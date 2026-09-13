import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import UrlInputForm from "../components/audit/UrlInputForm";
import DeviceToggle from "../components/audit/DeviceToggle";
import AuditButton from "../components/audit/AuditButton";
import AuditProgress from "../components/audit/AuditProgress";
import AuditStatus from "../components/audit/AuditStatus";

import auditService from "../services/auditService";

function NewAudit() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("desktop");
  const [auditState, setAuditState] = useState("idle");
  const [error, setError] = useState("");

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
        throw new Error("Audit completed but no audit ID was returned.");
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

  return (
    <DashboardLayout userName="Nitin K.">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold text-[#7c3aed]">
            Website Audit
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
            Audit a New Website
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Enter a website URL and analyze its performance,
            accessibility, SEO and best practices.
          </p>
        </div>

        {/* Audit Form */}
        {auditState === "idle" && (
          <div className="mt-10 rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-7">
            <div className="space-y-7">
              <UrlInputForm
                value={url}
                onChange={setUrl}
              />

              <DeviceToggle
                value={device}
                onChange={setDevice}
              />

              <div className="border-t border-[#eeeafd] pt-6">
                <AuditButton
                  disabled={!url.trim()}
                  onClick={handleStartAudit}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Running Audit */}
        {auditState === "running" && (
          <div className="mt-10 space-y-5">
            <AuditProgress
              url={url}
              device={device}
            />

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