import { useState } from "react";
import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

import Button from "../common/Button";
import Modal from "../common/Modal";

function DeleteAccount() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const handleDelete = () => {
    setIsModalOpen(false);

    // Backend account deletion will be connected later.
    console.log(
      "Account deletion requested"
    );
  };

  return (
    <>
      <section className="rounded-2xl border border-red-100 bg-white shadow-sm">
        <div className="border-b border-red-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Trash2 size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#181827]">
                Delete Account
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Permanently remove your account and associated data.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  This action cannot be undone.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  Deleting your account will permanently remove your
                  account data and audit history.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Button
              variant="danger"
              onClick={() =>
                setIsModalOpen(true)
              }
            >
              <Trash2 size={15} />
              Delete My Account
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        title="Delete your account?"
      >
        <div className="space-y-5">
          <p className="text-sm leading-6 text-gray-500">
            Are you sure you want to permanently delete your
            account? Your audit history and account data will be
            removed.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() =>
                setIsModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDelete}
            >
              <Trash2 size={15} />
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteAccount;