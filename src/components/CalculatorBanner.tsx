
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CalculatorBanner = () => {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#9b87f5] opacity-10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#9b87f5] opacity-10 rounded-full -ml-4 -mb-4"></div>
        
        <h3 className="text-xl font-bold mb-2 relative z-10">Start Investing Today</h3>
        <p className="text-gray-700 mb-4 relative z-10">
          Begin your investment journey with an SIP and watch your money grow over time. Low monthly investments with significant returns.
        </p>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white relative z-10">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalculatorBanner;
