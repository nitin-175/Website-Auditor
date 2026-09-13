import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children, userName = "User" }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9ff]">
      <Navbar
        variant="dashboard"
        userName={userName}
      />

      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() =>
            setSidebarCollapsed((previous) => !previous)
          }
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w p-5 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;