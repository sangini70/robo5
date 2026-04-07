import React from 'react';
import Link from 'next/link';
import { TrendingUp, PieChart, BookOpen, LineChart, Landmark, Calculator } from 'lucide-react';

const categories = [
  {
    id: 'exchange-rate',
    name: '환율',
    description: '원달러, 엔화, 환율 읽는 법',
    icon: TrendingUp,
    href: '/category/환율',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'etf',
    name: 'ETF',
    description: 'ETF 기초, 분산, 구조 이해',
    icon: PieChart,
    href: '/category/ETF',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'economy-basics',
    name: '경제 기초',
    description: '금리, 물가, 경기 흐름',
    icon: BookOpen,
    href: '/category/경제기초',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'us-stocks',
    name: '미국 증시',
    description: '나스닥, S&P500, 시황',
    icon: LineChart,
    href: '/category/미국증시',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'tax-support',
    name: '세금/지원금',
    description: '절세 팁, 청년 지원금',
    icon: Landmark,
    href: '/category/세금',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'calculator',
    name: '계산기',
    description: '환율 계산 및 수수료 확인',
    icon: Calculator,
    href: '/exchange-rate-calculator',
    color: 'bg-rose-50 text-rose-600',
  },
];

export function CategoriesSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">관심 주제 탐색</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
