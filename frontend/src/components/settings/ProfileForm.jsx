import { useState } from "react";
import {
  Check,
  Mail,
  User,
} from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";

function ProfileForm() {
  const [name, setName] =
    useState("Nitin K.");

  const [email, setEmail] =
    useState("nitin@example.com");

  const [saved, setSaved] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#eeeafd] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
            <User size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#181827]">
              Profile Information
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Update the information associated with your account.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-5 sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            icon={Mail}
          />
        </div>

        {/* Account role */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#181827]">
            Account Role
          </label>

          <div className="rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-4 py-3">
            <p className="text-sm font-medium text-gray-600">
              User
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Your account role is managed by the system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-[#eeeafd] pt-5 sm:flex-row sm:items-center sm:justify-between">
          {saved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <Check size={15} />
              Changes saved successfully.
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              Your profile information is private.
            </p>
          )}

          <Button
            type="submit"
            size="medium"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ProfileForm;