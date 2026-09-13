import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProfileForm from "../components/settings/ProfileForm";
import SecuritySettings from "../components/settings/SecuritySettings";
import ChangePassword from "../components/settings/ChangePassword";
import DeleteAccount from "../components/settings/DeleteAccount";

function Settings() {
  const [activeSection, setActiveSection] =
    useState("profile");

  const sections = [
    {
      id: "profile",
      label: "Profile",
    },
    {
      id: "security",
      label: "Security",
    },
    {
      id: "account",
      label: "Account",
    },
  ];

  return (
    <DashboardLayout userName="Nitin K.">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-[#7c3aed]">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage your profile, security and account preferences.
          </p>
        </div>

        {/* Navigation */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-xl border border-[#eeeafd] bg-white p-1.5 shadow-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  setActiveSection(section.id)
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeSection === section.id
                    ? "bg-[#7c3aed] text-white shadow-sm"
                    : "text-gray-500 hover:bg-[#faf9ff] hover:text-[#7c3aed]"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <ProfileForm />
          </div>
        )}

        {/* Security */}
        {activeSection === "security" && (
          <div className="space-y-6">
            <SecuritySettings />

            <ChangePassword />
          </div>
        )}

        {/* Account */}
        {activeSection === "account" && (
          <div className="space-y-6">
            <DeleteAccount />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Settings;