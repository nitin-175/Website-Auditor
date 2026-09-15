import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: Gauge,
      title: "Speed",
      description: "Find the bottlenecks slowing your website down.",
      className: "bg-[#eef0ff] text-[#4f46e5]",
    },
    {
      icon: Accessibility,
      title: "Accessibility",
      description: "Catch barriers that make your site harder to use.",
      className: "bg-[#fff0ed] text-[#e86b5d]",
    },
    {
      icon: SearchCheck,
      title: "SEO",
      description: "Find opportunities to improve discovery and visibility.",
      className: "bg-[#eef0ff] text-[#4f46e5]",
    },
    {
      icon: ShieldCheck,
      title: "Best Practices",
      description: "Reduce technical risk with practical recommendations.",
      className: "bg-[#eaf8f5] text-[#168f82]",
    },
  ];

  return (
    <section
      id="features"
      className="border-t border-[#dedbd1] bg-white py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
            What you can measure
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#172033] sm:text-4xl">
            Everything important,
            <span className="block">in one audit.</span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#6a6963] sm:text-base">
            Get a clear view of the areas that matter most for
            website quality.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-[#dedbd1] bg-[#fbfaf5] p-6 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_35px_rgba(23,32,51,0.07)]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.className}`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </div>

                <h3 className="mt-5 text-base font-extrabold text-[#172033]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#6a6963]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;