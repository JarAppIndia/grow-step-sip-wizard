
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const OtherCalculators = () => {
  const calculators = [
    { name: "SIP Calculator", path: "#" },
    { name: "Lumpsum Calculator", path: "#" },
    { name: "PPF Calculator", path: "#" },
    { name: "EMI Calculator", path: "#" },
    { name: "Retirement Calculator", path: "#" },
  ];

  return (
    <Card className="bg-[#2a196b] border-none shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Other Calculators</h3>
        <div className="space-y-3">
          {calculators.map((calc, index) => (
            <a 
              key={index} 
              href={calc.path}
              className="flex items-center justify-between p-3 rounded-md bg-[#302478] hover:bg-[#3a267b] transition-colors"
            >
              <span>{calc.name}</span>
              <ArrowRight className="h-4 w-4 text-[#9b87f5]" />
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OtherCalculators;
