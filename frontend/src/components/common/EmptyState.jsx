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
        min-h-64
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-[#ddd6f3]
        bg-white
        px-6
        py-10
        text-center
        ${className}
      `}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7c3aed]">
        <Icon size={22} />
      </div>

      <h3 className="text-base font-bold text-[#181827]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
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