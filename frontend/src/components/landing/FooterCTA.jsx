import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

function FooterCTA() {
  return (
    <section className="border-t border-[#eeeafd] bg-[#faf9ff]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#181827]">
            AuditPro
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Better websites start with better insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-gray-500">
          <a
            href="#features"
            className="transition hover:text-[#7c3aed]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-[#7c3aed]"
          >
            How It Works
          </a>

          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-[#7c3aed]"
          >
            Get Started
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FooterCTA;