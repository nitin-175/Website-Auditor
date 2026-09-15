import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router";

function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f4ed] px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#e7e5df] bg-white p-7 text-center shadow-sm sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f06f61]">
          <AlertTriangle size={23} />
        </div>

        <p className="mt-5 text-5xl font-extrabold tracking-tight text-[#f06f61]">
          500
        </p>

        <h1 className="mt-3 text-xl font-bold text-[#172033]">
          Something Went Wrong
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6b7280]">
          We encountered an unexpected problem. Please try again in a moment.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338ca]"
          >
            <RefreshCw size={15} />
            Try Again
          </button>

          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7e5df] px-5 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          <span className="h-1.5 w-7 rounded-full bg-[#4f46e5]" />
          <span className="h-1.5 w-4 rounded-full bg-[#19a999]" />
          <span className="h-1.5 w-2 rounded-full bg-[#f06f61]" />
        </div>
      </div>
    </div>
  );
}

export default ServerError;