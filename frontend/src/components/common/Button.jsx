import { LoaderCircle } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white shadow-sm hover:opacity-90",

    secondary:
      "bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#eadcff]",

    outline:
      "border border-[#7c3aed] bg-white text-[#7c3aed] hover:bg-[#faf5ff]",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    ghost:
      "bg-transparent text-gray-600 hover:bg-[#f5f3ff] hover:text-[#7c3aed]",
  };

  const sizes = {
    small: "px-3 py-2 text-xs",
    medium: "px-5 py-2.5 text-sm",
    large: "px-6 py-3 text-sm",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-semibold
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-[#8b5cf6]/30
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && (
        <LoaderCircle
          size={16}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}

export default Button;