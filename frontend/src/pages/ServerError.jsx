import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-[#eeeafd] bg-white p-7 text-center shadow-sm sm:p-10">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle size={30} />
          </div>

          {/* Error code */}
          <p className="mt-7 text-6xl font-extrabold tracking-tight text-red-500 sm:text-7xl">
            500
          </p>

          <h1 className="mt-4 text-xl font-bold text-[#181827] sm:text-2xl">
            Something Went Wrong
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            We encountered an unexpected problem while processing
            your request. Please try again in a moment.
          </p>

          {/* Actions */}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eeeafd] bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-[#faf9ff] hover:text-[#7c3aed]"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerError;