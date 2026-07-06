import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, FileText, Home, RefreshCw, Printer } from 'lucide-react';

export default function App() {
  // --- State for Inputs (Defaults based on user table) ---
  const [sellingPrice, setSellingPrice] = useState(650000);
  const [commissionRate, setCommissionRate] = useState(5);
  const [hstRate, setHstRate] = useState(13);
  const [legalFees, setLegalFees] = useState(1500);
  const [mortgageDischargeFee, setMortgageDischargeFee] = useState(300);

  // --- Derived Calculations (Constant Formulas) ---
  const commissionAmount = sellingPrice * (commissionRate / 100);
  const hstAmount = commissionAmount * (hstRate / 100);
  const totalClosingCosts = commissionAmount + hstAmount + legalFees + mortgageDischargeFee;
  const netProceeds = sellingPrice - totalClosingCosts;

  // --- Utility Functions ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleFocus = (e) => e.target.select();

  const handlePrint = () => {
    window.print();
  };

  const resetDefaults = () => {
    setSellingPrice(650000);
    setCommissionRate(5);
    setHstRate(13);
    setLegalFees(1500);
    setMortgageDischargeFee(300);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header with RE/MAX Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-[#003DA5] border-x border-b border-slate-100 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#003DA5]/10 text-[#003DA5] rounded-xl">
              <Home size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Closing Cost Calculator</h1>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Prepared by <span className="text-[#E11B22] font-bold">Eden Mesganaw</span> | RE/MAX Premier Inc. Realtor
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={resetDefaults}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Reset
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#003DA5] rounded-lg hover:bg-[#002a75] transition-colors shadow-sm"
            >
              <Printer size={16} className="mr-2" />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Editable Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <Calculator size={20} className="mr-2 text-[#E11B22]" />
                Adjustable Figures
              </h2>

              <div className="space-y-5">
                {/* Selling Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={sellingPrice === 0 ? '' : sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      onFocus={handleFocus}
                      className="block w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] transition-all text-lg font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Commission Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Real Estate Commission</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      onFocus={handleFocus}
                      className="block w-full pl-3 pr-9 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] transition-all text-slate-900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Percent size={16} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* HST Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">HST on Commission</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={hstRate}
                      onChange={(e) => setHstRate(Number(e.target.value))}
                      onFocus={handleFocus}
                      className="block w-full pl-3 pr-9 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] transition-all text-slate-900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Percent size={16} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Legal Fees */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Legal Fees & Disbursements</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={legalFees === 0 ? '' : legalFees}
                      onChange={(e) => setLegalFees(Number(e.target.value))}
                      onFocus={handleFocus}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Mortgage Discharge */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mortgage Discharge Fee (if applicable)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={mortgageDischargeFee === 0 ? '' : mortgageDischargeFee}
                      onChange={(e) => setMortgageDischargeFee(Number(e.target.value))}
                      onFocus={handleFocus}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] transition-all text-slate-900"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Breakdown and Results - Styled with RE/MAX Blue */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#003DA5] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              {/* RE/MAX Red Accent Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11B22] rounded-full mix-blend-screen filter blur-[80px] opacity-60 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
              
              <h2 className="text-lg font-medium text-blue-100 mb-2 relative z-10">Estimated Net Before Mortgage Payoff</h2>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 relative z-10">
                {formatCurrency(netProceeds)}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                  <span className="text-blue-100">Selling Price</span>
                  <span className="font-semibold text-lg">{formatCurrency(sellingPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                  <span className="text-blue-100">
                    Real Estate Commission <span className="text-sm bg-blue-900/50 px-2 py-0.5 rounded text-blue-200 ml-2">{commissionRate}%</span>
                  </span>
                  <span className="font-medium text-[#ff8e91]">-{formatCurrency(commissionAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                  <span className="text-blue-100">
                    HST on Commission <span className="text-sm bg-blue-900/50 px-2 py-0.5 rounded text-blue-200 ml-2">{hstRate}%</span>
                  </span>
                  <span className="font-medium text-[#ff8e91]">-{formatCurrency(hstAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                  <span className="text-blue-100">Legal Fees & Disbursements</span>
                  <span className="font-medium text-[#ff8e91]">-{formatCurrency(legalFees)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                  <span className="text-blue-100">Mortgage Discharge Fee</span>
                  <span className="font-medium text-[#ff8e91]">-{formatCurrency(mortgageDischargeFee)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 pb-2">
                  <span className="text-white font-medium flex items-center">
                    <FileText size={16} className="mr-2" />
                    Total Estimated Closing Costs
                  </span>
                  <span className="font-bold text-xl text-[#ff8e91]">-{formatCurrency(totalClosingCosts)}</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 flex items-start print:hidden">
               <div className="mr-3 mt-0.5 text-[#003DA5]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
               </div>
               <p>
                 <strong>Please Note:</strong> This calculator provides an estimate based on the figures provided. Actual closing costs may vary depending on your specific location, mortgage terms, and finalized agreements. This tool is designed to give you a strong baseline expectation.
               </p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .bg-\\[\\#003DA5\\] { background: white !important; color: black !important; box-shadow: none !important; border: 2px solid #003DA5; }
          .text-blue-100, .text-white { color: #0f172a !important; }
          .text-\\[\\#ff8e91\\] { color: #E11B22 !important; }
          .border-blue-800\\/50 { border-color: #e2e8f0 !important; }
          .bg-blue-900\\/50 { background: #f1f5f9 !important; color: #475569 !important; }
          .print\\:hidden, .mix-blend-screen { display: none !important; }
        }
      `}} />
    </div>
  );
}