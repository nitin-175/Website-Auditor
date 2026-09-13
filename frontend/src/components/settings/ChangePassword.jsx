import { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setMessage(
        "Please fill in all password fields."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(
        "New password and confirmation do not match."
      );

      return;
    }

    setMessage(
      "Password validation successful. Backend integration will be added later."
    );
  };

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
      <div className="border-b border-[#eeeafd] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
            <KeyRound size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#181827]">
              Change Password
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5 sm:p-6"
      >
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          placeholder="Enter current password"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm new password"
          />
        </div>

        {message && (
          <div className="flex items-start gap-2 rounded-xl bg-[#faf9ff] p-3 text-xs text-gray-600">
            <CheckCircle2
              size={15}
              className="mt-0.5 shrink-0 text-[#7c3aed]"
            />

            <span>{message}</span>
          </div>
        )}

        <div className="border-t border-[#eeeafd] pt-5">
          <Button type="submit">
            Update Password
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ChangePassword;