import { base44 } from "@/api/base44Client";
import HeroSection from "../components/landing/HeroSection";
import SocialProof from "../components/landing/SocialProof";
import FeaturesSection from "../components/landing/FeaturesSection";
import ROICalculator from "../components/landing/ROICalculator";
import PricingSection from "../components/landing/PricingSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";

export default function Landing() {
  const handleCTA = () => {
    base44.auth.redirectToLogin("/dashboard");
  };

  return (
    <div className="min-h-screen font-inter">
      <HeroSection onCTA={handleCTA} />
      <SocialProof />
      <FeaturesSection />
      <ROICalculator />
      <PricingSection onCTA={handleCTA} />
      <FAQSection />
      <CTASection onCTA={handleCTA} />
    </div>
  );
}