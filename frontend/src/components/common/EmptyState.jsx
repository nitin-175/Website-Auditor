import { FileSearch } from "lucide-react";

function EmptyState({
  icon: Icon = FileSearch,
  title = "Nothing here yet",
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex
        min-h-56
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-[#dcd9d0]
        bg-white
        px-6
        py-9
        text-center
        ${className}
      `}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
        <Icon size={21} />
      </div>

      <h3 className="text-base font-bold text-[#172033]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7280]">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;