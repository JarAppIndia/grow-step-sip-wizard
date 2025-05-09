
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

const StepUpSIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [investmentDuration, setInvestmentDuration] = useState(10);
  const [calculationResult, setCalculationResult] = useState({
    totalInvestment: 0,
    totalReturnWithoutStepUp: 0,
    totalReturnWithStepUp: 0,
    wealthGainedWithoutStepUp: 0,
    wealthGainedWithStepUp: 0,
  });
  const [showResults, setShowResults] = useState(false);

  // Calculate results
  const calculateResults = () => {
    // Regular SIP calculation
    let regularTotalInvestment = monthlyInvestment * 12 * investmentDuration;
    let regularMaturityAmount = calculateSIPReturns(monthlyInvestment, expectedReturnRate, investmentDuration, 0);
    
    // Step-up SIP calculation
    let stepUpTotalInvestment = 0;
    let stepUpMaturityAmount = calculateStepUpSIPReturns(
      monthlyInvestment,
      expectedReturnRate,
      investmentDuration,
      stepUpPercentage
    );
    
    // Calculate total investment for step-up SIP
    let currentMonthlyInvestment = monthlyInvestment;
    for (let i = 0; i < investmentDuration; i++) {
      stepUpTotalInvestment += currentMonthlyInvestment * 12;
      currentMonthlyInvestment += (currentMonthlyInvestment * stepUpPercentage) / 100;
    }

    setCalculationResult({
      totalInvestment: Math.round(stepUpTotalInvestment),
      totalReturnWithoutStepUp: Math.round(regularMaturityAmount),
      totalReturnWithStepUp: Math.round(stepUpMaturityAmount),
      wealthGainedWithoutStepUp: Math.round(regularMaturityAmount - regularTotalInvestment),
      wealthGainedWithStepUp: Math.round(stepUpMaturityAmount - stepUpTotalInvestment),
    });

    setShowResults(true);
  };

  // Function to calculate regular SIP returns
  const calculateSIPReturns = (monthlyAmount: number, rate: number, years: number, stepUp: number) => {
    const monthlyRate = rate / 12 / 100;
    let maturityAmount = 0;
    let installment = monthlyAmount;

    for (let i = 0; i < years * 12; i++) {
      maturityAmount = (maturityAmount + installment) * (1 + monthlyRate);
    }

    return maturityAmount;
  };

  // Function to calculate step-up SIP returns
  const calculateStepUpSIPReturns = (monthlyAmount: number, rate: number, years: number, stepUpPercentage: number) => {
    const monthlyRate = rate / 12 / 100;
    let maturityAmount = 0;
    let installment = monthlyAmount;
    
    // For each year
    for (let year = 0; year < years; year++) {
      // For each month in the year
      for (let month = 0; month < 12; month++) {
        maturityAmount = (maturityAmount + installment) * (1 + monthlyRate);
      }
      
      // Increase installment at the end of each year
      installment = installment + (installment * stepUpPercentage) / 100;
    }
    
    return maturityAmount;
  };

  // Format number to Indian rupee format
  const formatToInr = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="bg-[#2a196b] rounded-lg p-6 shadow-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Monthly Investment</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider 
                value={[monthlyInvestment]} 
                min={500} 
                max={100000} 
                step={500} 
                onValueChange={(value) => setMonthlyInvestment(value[0])} 
                className="accent-purple-500"
              />
            </div>
            <div className="w-28 bg-[#3a267b] p-2 rounded text-right">
              ₹{monthlyInvestment}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Annual Step-up (%)</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider 
                value={[stepUpPercentage]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(value) => setStepUpPercentage(value[0])} 
                className="accent-purple-500"
              />
            </div>
            <div className="w-28 bg-[#3a267b] p-2 rounded text-right">
              {stepUpPercentage}%
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Expected Rate of Return (%)</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider 
                value={[expectedReturnRate]} 
                min={1} 
                max={30} 
                step={0.1} 
                onValueChange={(value) => setExpectedReturnRate(value[0])} 
                className="accent-purple-500"
              />
            </div>
            <div className="w-28 bg-[#3a267b] p-2 rounded text-right">
              {expectedReturnRate}%
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Investment Period (years)</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider 
                value={[investmentDuration]} 
                min={1} 
                max={30} 
                step={1} 
                onValueChange={(value) => setInvestmentDuration(value[0])} 
                className="accent-purple-500"
              />
            </div>
            <div className="w-28 bg-[#3a267b] p-2 rounded text-right">
              {investmentDuration} years
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={calculateResults} 
            className="w-full py-6 text-lg font-medium bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            Calculate <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {showResults && (
          <div className="mt-8 space-y-6">
            <Card className="bg-[#302478] border-[#9b87f5] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-300 text-sm mb-1">Total Investment</h4>
                  <p className="text-xl font-bold text-white">{formatToInr(calculationResult.totalInvestment)}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm mb-1">Step-up SIP Returns</h4>
                  <p className="text-xl font-bold text-white">
                    {formatToInr(calculationResult.totalReturnWithStepUp - calculationResult.totalInvestment)}
                  </p>
                </div>
              </div>
            </Card>
            
            <div className="bg-[#302478] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Future Value Comparison</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>With Step-up SIP</span>
                  <span className="font-bold">{formatToInr(calculationResult.totalReturnWithStepUp)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Without Step-up</span>
                  <span className="font-bold">{formatToInr(calculationResult.totalReturnWithoutStepUp)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="font-medium">Additional Returns</span>
                  <span className="font-bold text-[#9b87f5]">
                    {formatToInr(calculationResult.totalReturnWithStepUp - calculationResult.totalReturnWithoutStepUp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepUpSIPCalculator;
