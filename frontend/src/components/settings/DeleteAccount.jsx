import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import userService from "../../services/userService";
import useAuthStore from "../../store/authStore";

function DeleteAccount() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await userService.deleteAccount();
      await logout();
      navigate("/login", { replace: true });
    } catch (deleteError) {
      setIsDeleting(false);
      setError(
        deleteError.response?.data?.message ||
          "Unable to delete your account. Please try again."
      );
    }
  };

  return (
    <section className="rounded-2xl border border-[#f3c7c1] bg-white shadow-sm">
      <div className="border-b border-[#f3c7c1] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3f1] text-[#d45b4f]">
            <Trash2 size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#172033]">
              Delete Account
            </h2>

            <p className="mt-1 text-xs text-[#8a8881]">
              Permanently remove your account and associated data.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="rounded-xl border border-[#f3c7c1] bg-[#fff8f6] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-[#d45b4f]"
            />

            <div>
              <p className="text-sm font-semibold text-[#b9473c]">
                This action permanently deletes your account.
              </p>

              <p className="mt-1 text-xs leading-5 text-[#c45a50]">
                Your profile, audits, schedules and account data will be
                removed. This cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d45b4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b9473c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={15} />
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </button>

          {error && (
            <p className="mt-3 text-sm font-medium text-[#b9473c]" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DeleteAccount;