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
    `text-sm font-semibold transition-colors ${
      isActive ? "text-[#4f46e5]" : "text-[#65645f] hover:text-[#172033]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#dedbd1] bg-[#fdfcf8]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          to={isDashboard ? "/app/dashboard" : "/"}
          className="flex items-center gap-2.5"
        >
          <span className="relative h-6 w-6 overflow-hidden rounded-md bg-[#4f46e5]">
            <span className="absolute left-1 top-1 h-4 w-2 rounded-sm bg-[#f06f61]" />
            <span className="absolute right-1 top-1 h-4 w-2 rounded-sm bg-[#19a999]" />
          </span>

          <span className="text-[17px] font-extrabold tracking-[-0.03em] text-[#172033]">
            AuditPro
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}

          {!isDashboard && (
            <Link
              to="/login"
              className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#29344a]"
            >
              Sign in
            </Link>
          )}

          {isDashboard && (
            <button
              type="button"
              className="rounded-full bg-[#172033] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#29344a]"
            >
              {userName}
            </button>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-[#172033] transition hover:bg-[#eeece4] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#dedbd1] bg-[#fdfcf8] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-[#eef0ff] text-[#4f46e5]"
                      : "text-[#65645f] hover:bg-[#f2f0e9] hover:text-[#172033]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!isDashboard && (
              <Link
                to="/login"
                className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#29344a]"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
