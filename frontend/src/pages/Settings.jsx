import { useEffect, useState } from "react";
import {
  CircleUserRound,
  LockKeyhole,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProfileForm from "../components/settings/ProfileForm";
import SecuritySettings from "../components/settings/SecuritySettings";
import ChangePassword from "../components/settings/ChangePassword";
import DeleteAccount from "../components/settings/DeleteAccount";
import userService from "../services/userService";

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userName, setUserName] = useState("User");

  const sections = [
    {
      id: "profile",
      label: "Profile",
      description: "Personal information",
      icon: UserRound,
    },
    {
      id: "security",
      label: "Security",
      description: "Password and protection",
      icon: LockKeyhole,
    },
    {
      id: "account",
      label: "Account",
      description: "Account management",
      icon: CircleUserRound,
    },
  ];

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const profile = await userService.getProfile();

        if (mounted && profile?.name) {
          setUserName(profile.name);
        }
      } catch {
        // ProfileForm handles its own profile loading/error state.
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const activeSectionData = sections.find(
    (section) => section.id === activeSection
  );

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-[#e7e5df] bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#eef2ff] blur-2xl" />

          <div className="absolute -bottom-20 right-32 h-36 w-36 rounded-full bg-[#e8f8f5] blur-2xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
              <SettingsIcon size={22} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center rounded-full border border-[#e0e7ff] bg-[#f5f7ff] px-3 py-1 text-xs font-semibold text-[#4f46e5]">
                Account
              </div>

              <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#172033] sm:text-3xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6d67]">
                Manage your profile, security and account preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Settings navigation */}
        <section className="rounded-2xl border border-[#e7e5df] bg-white p-2 shadow-sm">
          <div className="grid gap-1 md:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? "bg-[#4f46e5] text-white shadow-sm"
                      : "text-[#6a6963] hover:bg-[#f6f5f0] hover:text-[#172033]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-[#f1f3ff] text-[#4f46e5] group-hover:bg-[#e8ebff]"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        active ? "text-white" : "text-[#172033]"
                      }`}
                    >
                      {section.label}
                    </p>

                    <p
                      className={`mt-0.5 truncate text-xs ${
                        active
                          ? "text-indigo-100"
                          : "text-[#8b8982]"
                      }`}
                    >
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active section indicator */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e7e5df]" />

          <div className="inline-flex items-center gap-2 rounded-full border border-[#e7e5df] bg-white px-3 py-1.5 text-xs font-semibold text-[#77756f] shadow-sm">
            {activeSectionData && (
              <>
                <activeSectionData.icon
                  size={13}
                  className="text-[#19a999]"
                />
                {activeSectionData.label}
              </>
            )}
          </div>

          <div className="h-px flex-1 bg-[#e7e5df]" />
        </div>

        {/* Profile */}
        {activeSection === "profile" && <ProfileForm />}

        {/* Security */}
        {activeSection === "security" && (
          <div className="space-y-6">
            <SecuritySettings />
            <ChangePassword />
          </div>
        )}

        {/* Account */}
        {activeSection === "account" && <DeleteAccount />}
      </div>
      
    </DashboardLayout>
    
    
  );
}

export default Settings;