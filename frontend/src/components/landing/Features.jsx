import {
  Accessibility,
  Gauge,
  SearchCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: Gauge,
      title: "Performance",
      description:
        "Measure loading performance and understand the metrics affecting your website experience.",
    },
    {
      icon: Accessibility,
      title: "Accessibility",
      description:
        "Identify accessibility issues and make your website easier to use for everyone.",
    },
    {
      icon: SearchCheck,
      title: "SEO",
      description:
        "Find SEO-related issues that can affect how your website is discovered and indexed.",
    },
    {
      icon: ShieldCheck,
      title: "Best Practices",
      description:
        "Detect technical issues and recommendations that can improve website quality.",
    },
    {
      icon: Sparkles,
      title: "AI Insights",
      description:
        "Turn audit findings into practical recommendations that are easier to understand and act on.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b5cf6]">
            Everything you need
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#181827] sm:text-4xl">
            Understand Your Website Better
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
            Get a complete view of the areas that matter most for
            website quality.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[#eeeafd] bg-[#faf9ff] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ddd1ff] hover:bg-white hover:shadow-lg hover:shadow-[#7c3aed]/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3e8ff] to-[#fce7f3] text-[#7c3aed]">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 text-base font-bold text-[#181827]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
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