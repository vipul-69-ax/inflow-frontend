import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import BioLinkSection from "@/components/landing/BiolLinkSection";
import AIEngagementSection from "@/components/landing/AIEngagementSection";
import SmartSchedulingSection from "@/components/landing/SmartSchedulingSection";
import InfluenceWithoutLimitsSection from "@/components/landing/InfluenceSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const Home= ({onPress}:{onPress:()=>void}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection 
        onPress={onPress}
      />
      <BioLinkSection lottieAnimationPath="/animation/Section_2_optimized.json" />
      <AIEngagementSection lottieAnimationPath="/animation/Section_4_optimized.json" />
      <SmartSchedulingSection lottieAnimationPath="/animation/Section_3_optimized.json" />
      <InfluenceWithoutLimitsSection lottieAnimationPath="/animation/Section_5_optimized.json" />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;