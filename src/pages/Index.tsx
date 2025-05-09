
import { useState } from "react";
import StepUpSIPCalculator from "../components/StepUpSIPCalculator";
import CalculatorBanner from "../components/CalculatorBanner";
import OtherCalculators from "../components/OtherCalculators";
import SEOContent from "../components/SEOContent";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#241553] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Step-up SIP Calculator
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Calculator Column */}
          <div className="md:col-span-7">
            <StepUpSIPCalculator />
          </div>
          
          {/* Right Panel Column */}
          <div className="md:col-span-5 space-y-6">
            <CalculatorBanner />
            <OtherCalculators />
          </div>
        </div>
        
        {/* SEO Content */}
        <div className="mt-12">
          <SEOContent />
        </div>
      </div>
    </div>
  );
};

export default Index;
