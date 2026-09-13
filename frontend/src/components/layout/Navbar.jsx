import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar({ variant = "public", userName = "User" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = variant === "dashboard";

  const publicLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#how-it-works" },
];

  const dashboardLinks = [
    { label: "Dashboard", to: "/app/dashboard" },
    { label: "New Audit", to: "/app/new-audit" },
    { label: "History", to: "/app/history" },
    { label: "Compare", to: "/app/compare" },
    { label: "Settings", to: "/app/settings" },
  ];

  const links = isDashboard ? dashboardLinks : publicLinks;

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-[#7c3aed]"
        : "text-gray-500 hover:text-[#7c3aed]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#eeeafd] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to={isDashboard ? "/app/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <span className="h-5 w-5 rounded-md bg-linear-to-br from-[#7c3aed] to-[#ec4899]" />

          <span className="text-lg font-bold tracking-tight text-[#6d28d9]">
            AuditPro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}

          {!isDashboard && (
            <Link
              to="/login"
              className="rounded-lg bg-linear-to-r from-[#7c3aed] to-[#db2777] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Sign In
            </Link>
          )}

          {isDashboard && (
            <button
              type="button"
              className="rounded-full bg-linear-to-r from-[#7c3aed] to-[#2563eb] px-5 py-2 text-sm font-semibold text-white"
            >
              {userName}
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-[#f5f3ff] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#eeeafd] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-[#f3e8ff] text-[#7c3aed]"
                      : "text-gray-600 hover:bg-[#faf9ff]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!isDashboard && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-lg bg-linear-to-r from-[#7c3aed] to-[#db2777] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;