import { X } from "lucide-react";
import { useEffect } from "react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOverlayClick = true,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const sizes = {
    small: "max-w-sm",
    medium: "max-w-lg",
    large: "max-w-2xl",
  };

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/45 px-4"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={`w-full ${sizes[size]} overflow-hidden rounded-2xl border border-[#e7e5df] bg-white shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-[#e7e5df] px-5 py-4">
          <h2
            id="modal-title"
            className="text-lg font-bold text-[#172033]"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9a9891] transition hover:bg-[#f6f4ed] hover:text-[#4f46e5]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;