'use client';

import SearchHero from "../components/SearchHero";
import HowItWorks from "../components/HowItWorks";
import SizeGuideSection from "@/components/sections/SizeGuideSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import MapSection from "@/components/sections/MapSection";
import CTASection from "@/components/sections/CTASection";
import VideoPresentationSection from "@/components/sections/VideoPresentationSection";
import StorageForEverythingSection from "@/components/sections/StorageForEverythingSection";
import FAQSection from "@/components/FAQItem";
import InvestmentSection from "@/components/sections/InvestmentSection";



const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <SearchHero />
        <HowItWorks />
        <SizeGuideSection />
        <InvestmentSection />
        <MapSection locations={[]} />
        <CTASection />
        <VideoPresentationSection />
        <StorageForEverythingSection />
        <FAQSection />
      </main>
    </div>
  );
};

export default Home;

