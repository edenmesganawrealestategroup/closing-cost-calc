import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, FileText, Home, RefreshCw, Printer, Key, Tag, MapPin, UserCheck } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('sell'); // 'sell' or 'buy'

  // --- State for Inputs (Defaults based on user table) ---
  const [sellingPrice, setSellingPrice] = useState(650000);
  const [commissionRate, setCommissionRate] = useState(5);
  const [hstRate, setHstRate] = useState(13);
  const [legalFees, setLegalFees] = useState(1500);
  const [mortgageDischargeFee, setMortgageDischargeFee] = useState(300);

  // --- State for Buyer Inputs ---
  const [purchasePrice, setPurchasePrice] = useState(650000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isToronto, setIsToronto] = useState(false);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [buyerLegalFees, setBuyerLegalFees] = useState(1500);
  const [titleInsurance, setTitleInsurance] = useState(500);
  const [homeInspection, setHomeInspection] = useState(500);

  // --- Derived Calculations (Constant Formulas) ---
  const commissionAmount = sellingPrice * (commissionRate / 100);
  const hstAmount = commissionAmount * (hstRate / 100);
  const totalClosingCosts = commissionAmount + hstAmount + legalFees + mortgageDischargeFee;
  const netProceeds = sellingPrice - totalClosingCosts;

  // Buyer Calculations
  const calculateLTT = (price, inToronto, firstTime) => {
    let ontarioTax = 0;
    
    // Ontario Brackets
    if (price > 400000) {
      ontarioTax += (Math.min(price, 2000000) - 400000) * 0.02;
      if (price > 2000000) {
        ontarioTax += (price - 2000000) * 0.025;
      }
      ontarioTax += 4475; // Cumulative tax up to $400k
    } else if (price > 250000) {
      ontarioTax += (price - 250000) * 0.015 + 2225; // Cumulative up to $250k
    } else if (price > 55000) {
      ontarioTax += (price - 55000) * 0.01 + 275; // Cumulative up to $55k
    } else if (price > 0) {
      ontarioTax += price * 0.005;
    }

    let torontoTax = 0;
    if (inToronto) {
      torontoTax = ontarioTax; // Toronto Municipal LTT mathematically mirrors Ontario LTT
    }

    let ontarioRebate = 0;
    let torontoRebate = 0;
    
    if (firstTime) {
      ontarioRebate = Math.min(ontarioTax, 4000);
      if (inToronto) {
        torontoRebate = Math.min(torontoTax, 4475);
      }
    }
    
    return Math.max(0, ontarioTax - ontarioRebate) + Math.max(0, torontoTax - torontoRebate);
  };

  const landTransferTax = calculateLTT(purchasePrice, isToronto, isFirstTimeBuyer);
  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100);
  const mortgageAmount = purchasePrice - downPaymentAmount;
  const totalBuyerClosingCosts = landTransferTax + buyerLegalFees + titleInsurance + homeInspection;
  const totalCashNeeded = downPaymentAmount + totalBuyerClosingCosts;

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
    if (mode === 'sell') {
      setSellingPrice(650000);
      setCommissionRate(5);
      setHstRate(13);
      setLegalFees(1500);
      setMortgageDischargeFee(300);
    } else {
      setPurchasePrice(650000);
      setDownPaymentPercent(20);
      setIsToronto(false);
      setIsFirstTimeBuyer(false);
      setBuyerLegalFees(1500);
      setTitleInsurance(500);
      setHomeInspection(500);
    }
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

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8 print:hidden">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setMode('sell')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${mode === 'sell' ? 'bg-[#003DA5] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Tag size={16} className="mr-2" />
              Selling a Home
            </button>
            <button
              onClick={() => setMode('buy')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${mode === 'buy' ? 'bg-[#E11B22] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Key size={16} className="mr-2" />
              Purchasing a Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Editable Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <Calculator size={20} className={`mr-2 ${mode === 'sell' ? 'text-[#003DA5]' : 'text-[#E11B22]'}`} />
                Adjustable Figures
              </h2>

              {mode === 'sell' ? (
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
              ) : (
                <div className="space-y-5">
                  {/* Buyer Inputs */}
                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={purchasePrice === 0 ? '' : purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        onFocus={handleFocus}
                        className="block w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E11B22] focus:border-[#E11B22] transition-all text-lg font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Down Payment Percent */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        onFocus={handleFocus}
                        className="block w-full pl-3 pr-9 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E11B22] focus:border-[#E11B22] transition-all text-slate-900"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Percent size={16} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Smart Land Transfer Tax Calculator */}
                  <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center">
                      <MapPin size={16} className="mr-2 text-[#E11B22]" />
                      Land Transfer Tax Details
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <label className="text-sm font-medium text-slate-700">Property Location</label>
                      <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm w-full sm:w-auto">
                        <button 
                          onClick={() => setIsToronto(false)}
                          className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${!isToronto ? 'bg-[#E11B22] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Ontario
                        </button>
                        <button 
                          onClick={() => setIsToronto(true)}
                          className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${isToronto ? 'bg-[#E11B22] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          City of Toronto
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <label className="text-sm font-medium text-slate-700">First-Time Home Buyer?</label>
                      <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm w-full sm:w-auto">
                        <button 
                          onClick={() => setIsFirstTimeBuyer(false)}
                          className={`flex-1 px-6 py-1.5 text-xs font-semibold rounded-md transition-colors ${!isFirstTimeBuyer ? 'bg-[#E11B22] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          No
                        </button>
                        <button 
                          onClick={() => setIsFirstTimeBuyer(true)}
                          className={`flex-1 px-6 py-1.5 text-xs font-semibold rounded-md transition-colors ${isFirstTimeBuyer ? 'bg-[#E11B22] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                       <span className="text-sm text-slate-600 font-semibold">Calculated LTT:</span>
                       <span className="text-lg font-bold text-[#E11B22] bg-[#E11B22]/10 px-3 py-1 rounded-lg">
                          {formatCurrency(landTransferTax)}
                       </span>
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
                        value={buyerLegalFees === 0 ? '' : buyerLegalFees}
                        onChange={(e) => setBuyerLegalFees(Number(e.target.value))}
                        onFocus={handleFocus}
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E11B22] focus:border-[#E11B22] transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Title Insurance */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title Insurance</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={titleInsurance === 0 ? '' : titleInsurance}
                        onChange={(e) => setTitleInsurance(Number(e.target.value))}
                        onFocus={handleFocus}
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E11B22] focus:border-[#E11B22] transition-all text-slate-900"
                      />
                    </div>
                  </div>
                  
                  {/* Home Inspection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Home Inspection</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={homeInspection === 0 ? '' : homeInspection}
                        onChange={(e) => setHomeInspection(Number(e.target.value))}
                        onFocus={handleFocus}
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E11B22] focus:border-[#E11B22] transition-all text-slate-900"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Right Column: Breakdown and Results - Styled with RE/MAX Blue */}
          <div className="lg:col-span-7 space-y-6">
            {mode === 'sell' ? (
              <div className="bg-[#003DA5] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                {/* RE/MAX Red Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11B22] rounded-full mix-blend-screen filter blur-[80px] opacity-60 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                
                <h2 className="text-lg font-medium text-blue-100 mb-2">Estimated Net Before Mortgage Payoff</h2>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
                  {formatCurrency(netProceeds)}
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center py-3 border-b border-blue-800">
                    <span className="text-blue-100">Selling Price</span>
                    <span className="font-semibold text-lg">{formatCurrency(sellingPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-blue-800">
                    <span className="text-blue-100">
                      Real Estate Commission <span className="text-sm bg-blue-900/50 px-2 py-0.5 rounded text-blue-200 ml-2">{commissionRate}%</span>
                    </span>
                    <span className="font-medium text-[#ffb3b6]">-{formatCurrency(commissionAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-blue-800">
                    <span className="text-blue-100">
                      HST on Commission <span className="text-sm bg-blue-900/50 px-2 py-0.5 rounded text-blue-200 ml-2">{hstRate}%</span>
                    </span>
                    <span className="font-medium text-[#ffb3b6]">-{formatCurrency(hstAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-blue-800">
                    <span className="text-blue-100">Legal Fees & Disbursements</span>
                    <span className="font-medium text-[#ffb3b6]">-{formatCurrency(legalFees)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-blue-800">
                    <span className="text-blue-100">Mortgage Discharge Fee</span>
                    <span className="font-medium text-[#ffb3b6]">-{formatCurrency(mortgageDischargeFee)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 pb-2">
                    <span className="text-blue-50 font-medium flex items-center">
                      <FileText size={16} className="mr-2" />
                      Total Estimated Closing Costs
                    </span>
                    <span className="font-bold text-xl text-[#ffb3b6]">-{formatCurrency(totalClosingCosts)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#E11B22] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                {/* RE/MAX Blue Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#003DA5] rounded-full mix-blend-screen filter blur-[80px] opacity-60 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                
                <h2 className="text-lg font-medium text-red-100 mb-2">Total Cash Needed to Close</h2>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
                  {formatCurrency(totalCashNeeded)}
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">Purchase Price</span>
                    <span className="font-semibold text-lg">{formatCurrency(purchasePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">
                      Down Payment <span className="text-sm bg-red-900/50 px-2 py-0.5 rounded text-red-200 ml-2">{downPaymentPercent}%</span>
                    </span>
                    <span className="font-medium text-white">{formatCurrency(downPaymentAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">Estimated Land Transfer Tax</span>
                    <span className="font-medium text-red-200">{formatCurrency(landTransferTax)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">Legal Fees & Disbursements</span>
                    <span className="font-medium text-red-200">{formatCurrency(buyerLegalFees)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">Title Insurance</span>
                    <span className="font-medium text-red-200">{formatCurrency(titleInsurance)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-red-800">
                    <span className="text-red-100">Home Inspection</span>
                    <span className="font-medium text-red-200">{formatCurrency(homeInspection)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 pb-2">
                    <span className="text-red-50 font-medium flex items-center">
                      <FileText size={16} className="mr-2" />
                      Total Additional Closing Costs
                    </span>
                    <span className="font-bold text-xl text-white">{formatCurrency(totalBuyerClosingCosts)}</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t-2 border-red-800/50">
                    <h2 className="text-lg font-medium text-red-100 mb-2">Estimated Mortgage Amount</h2>
                    <div className="text-3xl font-bold tracking-tight">
                      {formatCurrency(mortgageAmount)}
                    </div>
                  </div>

                </div>
              </div>
            )}
            
            {/* Disclaimer */}
            <div className={`p-4 rounded-xl text-sm flex items-start print:hidden ${mode === 'sell' ? 'bg-[#003DA5]/10 border border-[#003DA5]/20 text-[#003DA5]' : 'bg-[#E11B22]/10 border border-[#E11B22]/20 text-[#E11B22]'}`}>
               <div className="mr-3 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
               </div>
               <p>
                 <strong>Please Note:</strong> This calculator provides an estimate based on the figures provided. Actual closing costs may vary depending on your specific location, mortgage terms, and finalized agreements. {mode === 'sell' ? 'This tool is designed to give you a strong baseline expectation.' : 'Land Transfer Tax is an estimate and varies by municipality (e.g., Toronto has municipal LTT).'}
               </p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .bg-\\[\\#003DA5\\], .bg-\\[\\#E11B22\\] { background: white !important; color: black !important; box-shadow: none !important; border: 1px solid #e2e8f0; }
          .text-blue-100, .text-red-100 { color: #475569 !important; }
          .text-white { color: #0f172a !important; }
          .text-\\[\\#ffb3b6\\] { color: #dc2626 !important; }
          .text-red-200 { color: #475569 !important; }
          .border-blue-800, .border-red-800 { border-color: #e2e8f0 !important; }
          .bg-blue-900\\/50, .bg-red-900\\/50 { background: #f1f5f9 !important; color: #475569 !important; }
          .print\\:hidden { display: none !important; }
          .mix-blend-screen { display: none !important; }
        }
      `}} />
    </div>
  );
}
