import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link } from "react-router";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f4ed] px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#e7e5df] bg-white p-7 text-center shadow-sm sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4df] text-[#d99a22]">
          <LockKeyhole size={23} />
        </div>

        <p className="mt-5 text-5xl font-extrabold tracking-tight text-[#d99a22]">
          403
        </p>

        <h1 className="mt-3 text-xl font-bold text-[#172033]">
          Access Denied
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6b7280]">
          You don't have permission to access this page. Please sign in with
          an authorized account.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338ca]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-[#e7e5df] px-5 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
          >
            Sign In
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

export default Unauthorized;