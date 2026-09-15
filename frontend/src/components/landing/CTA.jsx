import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function CTA() {
  return (
    <section className="px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-[1100px]">
        <div className="relative overflow-hidden rounded-2xl border border-[#e7e5df] bg-white px-6 py-9 shadow-sm sm:px-10 sm:py-11">
          {/* Accent line */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#4f46e5] via-[#19a999] to-[#f06f61]" />

          <div className="relative flex flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#4f46e5]">
                Start your audit
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                Ready to Audit Your Website?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Discover performance, accessibility, SEO and best-practice
                opportunities with a detailed website audit.
              </p>
            </div>

            <Link
              to="/login"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-md"
            >
              Start Your Audit
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Small accent details */}
          <div className="mt-7 flex items-center justify-center gap-2 md:justify-start">
            <span className="h-1.5 w-8 rounded-full bg-[#4f46e5]" />
            <span className="h-1.5 w-5 rounded-full bg-[#19a999]" />
            <span className="h-1.5 w-3 rounded-full bg-[#f06f61]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;