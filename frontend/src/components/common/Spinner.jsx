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
        border-[#ddd6fe]
        border-t-[#7c3aed]
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;