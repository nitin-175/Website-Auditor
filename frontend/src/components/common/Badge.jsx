function Badge({
  children,
  variant = "default",
  size = "medium",
  className = "",
}) {
  const variants = {
    default:
      "bg-gray-100 text-gray-600",

    primary:
      "bg-[#f3e8ff] text-[#7c3aed]",

    success:
      "bg-emerald-50 text-emerald-600",

    warning:
      "bg-amber-50 text-amber-600",

    danger:
      "bg-red-50 text-red-600",

    info:
      "bg-blue-50 text-blue-600",
  };

  const sizes = {
    small: "px-2 py-0.5 text-[10px]",
    medium: "px-2.5 py-1 text-xs",
    large: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;