import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePlus2,
  GitCompare,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ collapsed = false, onToggle }) {
  const navigationItems = [
    {
      label: "Dashboard",
      to: "/app/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "New Audit",
      to: "/app/new-audit",
      icon: FilePlus2,
    },
    {
      label: "History",
      to: "/app/history",
      icon: Clock3,
    },
    {
      label: "Compare",
      to: "/app/compare",
      icon: GitCompare,
    },
    {
      label: "Settings",
      to: "/app/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative hidden min-h-[calc(100vh-70px)] border-r border-[#e7e5df] bg-[#fbfaf5] transition-all duration-300 lg:block ${
        collapsed ? "w-[76px]" : "w-[224px]"
      }`}
    >
      <nav className="flex flex-col gap-1.5 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#eef0ff] text-[#4f46e5]"
                    : "text-[#6a6963] hover:bg-[#f0eee7] hover:text-[#172033]"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 h-5 w-0.5 rounded-full bg-[#4f46e5]" />
                  )}

                  <Icon size={18} strokeWidth={1.8} />

                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-5 hidden h-6 w-6 items-center justify-center rounded-full border border-[#d8d5ca] bg-white text-[#65645f] shadow-sm transition hover:border-[#4f46e5] hover:text-[#4f46e5] lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={13} />
        ) : (
          <ChevronLeft size={13} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;