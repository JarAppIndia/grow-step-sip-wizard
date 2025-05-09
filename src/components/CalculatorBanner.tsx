
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CalculatorBanner = () => {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">Start Investing Today</h3>
        <p className="text-gray-700 mb-4">
          Begin your investment journey with an SIP and watch your money grow over time. Low monthly investments with significant returns.
        </p>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalculatorBanner;
