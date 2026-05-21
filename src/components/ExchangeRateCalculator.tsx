'use client';

import React, { useState, useEffect } from 'react';

export function ExchangeRateCalculator() {
  const [amount, setAmount] = useState<string>('1000');
  const [exchangeRate, setExchangeRate] = useState<string>('1350');
  const [preferentialRate, setPreferentialRate] = useState<string>('90');
  const [feeRate, setFeeRate] = useState<string>('1.75'); // 기본 환전수수료율 예시

  const [result, setResult] = useState({
    baseKrw: 0,
    finalKrw: 0,
    appliedRate: 0,
    savedAmount: 0,
  });

  useEffect(() => {
    calculate();
  }, [amount, exchangeRate, preferentialRate, feeRate]);

  const calculate = () => {
    const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    const numExchangeRate = parseFloat(exchangeRate.replace(/,/g, '')) || 0;
    const numPrefRate = parseFloat(preferentialRate) || 0;
    const numFeeRate = parseFloat(feeRate) || 0;

    // 기준 원화 금액 = 외화 금액 * 매매기준율
    const baseKrw = numAmount * numExchangeRate;

    // 수수료 = 기준 원화 금액 * (수수료율 / 100)
    const baseFee = baseKrw * (numFeeRate / 100);

    // 할인된 수수료 = 수수료 * (1 - 우대율 / 100)
    const discountedFee = baseFee * (1 - numPrefRate / 100);

    // 최종 원화 금액 (살 때 기준: 기준 금액 + 할인된 수수료)
    const finalKrw = baseKrw + discountedFee;

    // 적용 환율 (체감 환율) = 최종 원화 금액 / 외화 금액
    const appliedRate = numAmount > 0 ? finalKrw / numAmount : 0;

    // 절약된 금액 = 원래 수수료 - 할인된 수수료
    const savedAmount = baseFee - discountedFee;

    setResult({
      baseKrw,
      finalKrw,
      appliedRate,
      savedAmount,
    });
  };

  const formatCurrency = (value: number) => {
    return Math.round(value).toLocaleString('ko-KR');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm font-sans max-w-2xl mx-auto my-8">
      <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-6 border-b border-gray-100 pb-4">
        실속 환율 계산기
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환전할 금액 (외화)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매매기준율 (환율)</label>
            <div className="relative">
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="1350"
              />
              <span className="absolute right-4 top-2 text-gray-500">원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">환전 수수료율</label>
              <div className="relative">
                <input
                  type="number"
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="1.75"
                  step="0.01"
                />
                <span className="absolute right-4 top-2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">환율 우대율</label>
              <div className="relative">
                <input
                  type="number"
                  value={preferentialRate}
                  onChange={(e) => setPreferentialRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="90"
                  max="100"
                />
                <span className="absolute right-4 top-2 text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="bg-indigo-50 rounded-md p-6 flex flex-col justify-center border border-indigo-100">
          <div className="mb-4">
            <span className="block text-sm text-indigo-800 mb-1">예상 필요 원화 (살 때)</span>
            <span className="block text-3xl font-bold text-indigo-900 tracking-tight">
              {formatCurrency(result.finalKrw)} <span className="text-lg font-medium">원</span>
            </span>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-indigo-200/50">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700">기준 원화 금액</span>
              <span className="font-medium text-indigo-900">{formatCurrency(result.baseKrw)} 원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700">체감 적용 환율</span>
              <span className="font-medium text-indigo-900">{result.appliedRate.toFixed(2)} 원</span>
            </div>
            {result.savedAmount > 0 && (
              <div className="flex justify-between text-sm font-medium text-green-600 mt-2 pt-2 border-t border-indigo-200/50">
                <span>우대율로 아낀 수수료</span>
                <span>-{formatCurrency(result.savedAmount)} 원</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        * 본 계산기는 참고용이며, 실제 금융기관의 고시 환율 및 수수료 정책에 따라 차이가 발생할 수 있습니다.
      </p>
    </div>
  );
}
