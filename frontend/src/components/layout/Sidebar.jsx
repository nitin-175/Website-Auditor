import {
  /*BarChart3,*/
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
      className={`relative hidden min-h-[calc(100vh-64px)] border-r border-[#eeeafd] bg-white transition-all duration-300 lg:block ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-linear-to-r from-[#7c3aed] to-[#db2777] text-white shadow-sm"
                    : "text-gray-500 hover:bg-[#f7f3ff] hover:text-[#7c3aed]"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon size={17} strokeWidth={2} />

              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-5 hidden h-6 w-6 items-center justify-center rounded-full border border-[#e9e4fa] bg-white text-gray-500 shadow-sm transition hover:text-[#7c3aed] lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;