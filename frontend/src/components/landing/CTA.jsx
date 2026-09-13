import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function CTA() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-gradient-to-r from-[#7c3aed] to-[#db2777] px-6 py-12 text-center shadow-xl shadow-[#7c3aed]/10 sm:px-12 sm:py-16">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Audit Your Website?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
          Discover performance, accessibility, SEO and best-practice
          opportunities with a detailed website audit.
        </p>

        <Link
          to="/login"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#7c3aed] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#faf9ff]"
        >
          Start Your Audit
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export default CTA;