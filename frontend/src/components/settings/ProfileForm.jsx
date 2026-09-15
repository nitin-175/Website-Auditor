import { useEffect, useState } from "react";
import { Check, Mail, User } from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import userService from "../../services/userService";

function ProfileForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await userService.getProfile();

        if (!mounted) return;

        setName(profile?.name ?? "");
        setEmail(profile?.email ?? "");

        const roles = profile?.roles;

        if (Array.isArray(roles) && roles.length > 0) {
          setRole(
            roles
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.name ?? item?.role ?? ""
              )
              .filter(Boolean)
              .join(", ")
          );
        } else {
          setRole(profile?.role ?? "USER");
        }
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError?.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name cannot be empty.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedProfile = await userService.updateProfile({
        name: name.trim(),
      });

      setName(updatedProfile?.name ?? name.trim());

      if (updatedProfile?.email) {
        setEmail(updatedProfile.email);
      }

      setMessage("Changes saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to save your profile."
      );
      setMessage("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-[#dedbd1] bg-white shadow-sm">
        <div className="border-b border-[#dedbd1] px-5 py-5 sm:px-6">
          <div className="h-5 w-40 animate-pulse rounded bg-[#eeece4]" />
          <div className="mt-2 h-3 w-64 animate-pulse rounded bg-[#f2f0e9]" />
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-11 animate-pulse rounded-xl bg-[#f2f0e9]" />
            <div className="h-11 animate-pulse rounded-xl bg-[#f2f0e9]" />
          </div>

          <div className="h-20 animate-pulse rounded-xl bg-[#f2f0e9]" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#dedbd1] bg-white shadow-sm">
      <div className="border-b border-[#dedbd1] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
            <User size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#172033]">
              Profile Information
            </h2>

            <p className="mt-1 text-xs text-[#8a8881]">
              Update the information associated with your account.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled
            icon={Mail}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#172033]">
            Account Role
          </label>

          <div className="rounded-xl border border-[#dedbd1] bg-[#f7f6f0] px-4 py-3">
            <p className="text-sm font-semibold text-[#172033]">
              {role || "USER"}
            </p>

            <p className="mt-1 text-xs text-[#8a8881]">
              Your account role is managed by the system.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-[#f3c7c1] bg-[#fff3f1] p-3 text-sm font-medium text-[#c94f43]">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-[#dedbd1] pt-5 sm:flex-row sm:items-center sm:justify-between">
          {message ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#138f82]">
              <Check size={15} />
              {message}
            </div>
          ) : (
            <p className="text-xs text-[#8a8881]">
              Your profile information is private.
            </p>
          )}

          <Button type="submit" size="medium" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ProfileForm;