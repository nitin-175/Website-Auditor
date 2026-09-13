import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import NewAudit from "../pages/NewAudit";
import History from "../pages/History";
import Compare from "../pages/Compare";
import Settings from "../pages/Settings";
import Report from "../pages/Report";
import useAuthStore from "../store/authStore";

function ProtectedRoutes() {
  const location = useLocation();
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <Routes>
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

      <Route path="dashboard" element={<Dashboard />} />

      <Route path="new-audit" element={<NewAudit />} />

      <Route path="history" element={<History />} />

      <Route path="compare" element={<Compare />} />

      <Route path="settings" element={<Settings />} />

      <Route path="report/:auditId" element={<Report />} />

      <Route
        path="*"
        element={
          <Navigate
            to="/app/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default ProtectedRoutes;