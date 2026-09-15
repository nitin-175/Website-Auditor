import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

function FooterCTA() {
  return (
    <section className="border-t border-[#dedbd1] bg-[#f6f4ed]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-[#172033]">
            AuditPro
          </p>

          <p className="mt-1 text-xs text-[#77756e]">
            Better websites start with better insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-[#65645f]">
          <a
            href="#features"
            className="transition hover:text-[#4f46e5]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-[#4f46e5]"
          >
            How It Works
          </a>

          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-[#4f46e5]"
          >
            Get started
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FooterCTA;