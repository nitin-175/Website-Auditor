import { Link } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9ff] px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-[#eeeafd] bg-white p-7 text-center shadow-sm sm:p-10">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3e8ff] text-[#7c3aed]">
            <SearchX size={30} />
          </div>

          {/* Error code */}
          <p className="mt-7 text-6xl font-extrabold tracking-tight text-[#7c3aed] sm:text-7xl">
            404
          </p>

          <h1 className="mt-4 text-xl font-bold text-[#181827] sm:text-2xl">
            Page Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            The page you're looking for doesn't exist or may
            have been moved to another location.
          </p>

          {/* Action */}
          <div className="mt-7">
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;