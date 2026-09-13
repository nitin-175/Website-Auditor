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
        rounded-lg
        border
        border-red-100
        bg-red-50
        p-4
        ${className}
      `}
      role="alert"
    >
      <AlertCircle
        size={18}
        className="mt-0.5 shrink-0 text-red-500"
      />

      <div>
        {title && (
          <p className="text-sm font-semibold text-red-700">
            {title}
          </p>
        )}

        <p className="text-sm text-red-600">
          {message}
        </p>
      </div>
    </div>
  );
}

export default ErrorMessage;