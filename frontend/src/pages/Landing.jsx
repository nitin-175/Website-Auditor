import AuthLayout from "../components/layout/AuthLayout";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import WhyUseAuditor from "../components/landing/WhyUseAuditor";
import CTA from "../components/landing/CTA";
import FooterCTA from "../components/landing/FooterCTA";

function Landing() {
  return (
    <AuthLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <WhyUseAuditor />
      <CTA />
      <FooterCTA />
    </AuthLayout>
  );
}

export default Landing;