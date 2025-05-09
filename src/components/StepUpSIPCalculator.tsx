import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ChartBar } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  const [yearlyData, setYearlyData] = useState<any[]>([]);

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

    // Calculate yearly data for chart and table
    const yearData = calculateYearlyData();
    setYearlyData(yearData);
    
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

  // Calculate yearly data for chart and table
  const calculateYearlyData = () => {
    const data = [];
    let regularMonthlyInvestment = monthlyInvestment;
    let stepUpMonthlyInvestment = monthlyInvestment;
    let regularAmount = 0;
    let stepUpAmount = 0;
    
    for (let year = 1; year <= investmentDuration; year++) {
      // Calculate for regular SIP
      for (let month = 0; month < 12; month++) {
        regularAmount = (regularAmount + regularMonthlyInvestment) * (1 + expectedReturnRate / 12 / 100);
      }
      
      // Calculate for step-up SIP
      for (let month = 0; month < 12; month++) {
        stepUpAmount = (stepUpAmount + stepUpMonthlyInvestment) * (1 + expectedReturnRate / 12 / 100);
      }
      
      // Increase step-up SIP amount for next year
      stepUpMonthlyInvestment += (stepUpMonthlyInvestment * stepUpPercentage) / 100;
      
      // Add data for this year
      data.push({
        year: year,
        regularSIP: Math.round(regularAmount),
        stepUpSIP: Math.round(stepUpAmount),
        invested: Math.round(regularMonthlyInvestment * 12 * year),
        stepUpInvested: Math.round((year === 1 ? monthlyInvestment * 12 : data[year - 2].stepUpInvested + stepUpMonthlyInvestment * 12))
      });
    }
    
    return data;
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
            
            {/* Chart and table side-by-side visualization */}
            <div className="bg-[#302478] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ChartBar className="text-[#9b87f5]" />
                Investment Growth Comparison
              </h3>
              
              {/* Grid layout for side-by-side display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart section */}
                <div className="h-[400px]">
                  <ChartContainer 
                    config={{
                      regular: { color: "#33C3F0", label: "Regular SIP" },
                      stepup: { color: "#9b87f5", label: "Step-up SIP" },
                    }}
                  >
                    <BarChart
                      data={yearlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fill: '#fff' }}
                        label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#fff' }}
                      />
                      <YAxis 
                        tick={{ fill: '#fff' }}
                        tickFormatter={(value) => value >= 1000000 
                          ? `₹${(value / 1000000).toFixed(1)}M` 
                          : `₹${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-medium">Year {payload[0].payload.year}</p>
                                <p className="text-[#33C3F0]">
                                  Regular SIP: {formatToInr(payload[0].payload.regularSIP)}
                                </p>
                                <p className="text-[#9b87f5]">
                                  Step-up SIP: {formatToInr(payload[0].payload.stepUpSIP)}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                  Difference: {formatToInr(payload[0].payload.stepUpSIP - payload[0].payload.regularSIP)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="regularSIP" fill="#33C3F0" name="Regular SIP" />
                      <Bar dataKey="stepUpSIP" fill="#9b87f5" name="Step-up SIP" />
                    </BarChart>
                  </ChartContainer>
                </div>
                
                {/* Table section */}
                <div className="overflow-y-auto max-h-[400px] pr-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-700">
                        <TableHead className="text-white">Year</TableHead>
                        <TableHead className="text-white">Regular SIP</TableHead>
                        <TableHead className="text-white">Step-up SIP</TableHead>
                        <TableHead className="text-white">Extra Returns</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.map((data, index) => (
                        <TableRow key={index} className="border-b border-gray-700">
                          <TableCell className="text-white">{data.year}</TableCell>
                          <TableCell className="text-white">{formatToInr(data.regularSIP)}</TableCell>
                          <TableCell className="text-white">{formatToInr(data.stepUpSIP)}</TableCell>
                          <TableCell className="text-[#9b87f5] font-medium">
                            {formatToInr(data.stepUpSIP - data.regularSIP)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
