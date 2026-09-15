import { AlertCircle } from "lucide-react";

function ErrorMessage({
  message = "Something went wrong. Please try again.",
  title,
  className = "",
}) {
  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-[#f6d5d0]
        bg-[#fff7f5]
        p-4
        ${className}
      `}
      role="alert"
    >
      <AlertCircle
        size={18}
        className="mt-0.5 shrink-0 text-[#f06f61]"
      />

      <div>
        {title && (
          <p className="text-sm font-semibold text-[#172033]">
            {title}
          </p>
        )}

        <p className="text-sm leading-5 text-[#8a5a55]">
          {message}
        </p>
      </div>
    </div>
  );
}

export default ErrorMessage;