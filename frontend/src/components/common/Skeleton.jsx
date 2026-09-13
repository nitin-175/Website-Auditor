function Skeleton({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-[#e9e4f7]
        ${width}
        ${height}
        ${rounded}
        ${className}
      `}
      aria-hidden="true"
    />
  );
}

export default Skeleton;