function Spinner({
  size = "medium",
  className = "",
}) {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-10 w-10",
  };

  return (
    <span
      className={`
        inline-block
        animate-spin
        rounded-full
        border-2
        border-[#e7e5df]
        border-t-[#4f46e5]
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;