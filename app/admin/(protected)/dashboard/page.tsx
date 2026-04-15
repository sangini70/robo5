'use client';

import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../src/firebase';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        // The API returns basic stats, we might need to calculate some things client-side 
        // if the API doesn't provide everything.
        // For now, let's adapt the UI to what the API provides.
        
        setStats({
          totalViews: data.totalViews || 0,
          avgCTR: data.avgCTR || '0.00',
          topPosts: data.topPosts || [],
          lowCtrPosts: data.lowCtrPosts || [],
          highCtrLowViewsPosts: data.highCtrLowViewsPosts || [],
          trendData: data.trendData || [],
          hourData: data.hourData || []
=======
        const snapshot = await getDocs(collection(db, 'posts'));
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        let totalViews = 0;
        let totalImpressions = 0;
        let totalClicks = 0;
        
        // For last 7 days trend
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });
        
        const viewsByDate: Record<string, number> = {};
        last7Days.forEach(date => viewsByDate[date] = 0);

        // For publish hour performance
        const viewsByHour: Record<number, { views: number, count: number }> = {};
        for (let i = 0; i < 24; i++) {
          viewsByHour[i] = { views: 0, count: 0 };
        }

        posts.forEach(post => {
          totalViews += (post.postViews || 0);
          totalImpressions += (post.impressions || 0);
          totalClicks += (post.clicks || 0);

          // Aggregate daily views
          if (post.dailyViews) {
            last7Days.forEach(date => {
              if (post.dailyViews[date]) {
                viewsByDate[date] += post.dailyViews[date];
              }
            });
          }

          // Aggregate publish hour performance
          if (post.publishHour !== undefined) {
            viewsByHour[post.publishHour].views += (post.postViews || 0);
            viewsByHour[post.publishHour].count += 1;
          }
        });

        const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
        const avgViews = posts.length > 0 ? totalViews / posts.length : 0;
        const avgCtrNum = parseFloat(avgCTR);

        const postsWithCtr = posts.map(post => {
          const imp = post.impressions || 0;
          const clk = post.clicks || 0;
          const ctr = imp > 0 ? (clk / imp) * 100 : 0;
          return { ...post, ctr, impressions: imp, clicks: clk };
        });

        const topPosts = [...postsWithCtr]
          .sort((a, b) => (b.postViews || 0) - (a.postViews || 0))
          .slice(0, 5);

        // CTR 낮은 글 TOP5 (impressions >= 10)
        const lowCtrPosts = [...postsWithCtr]
          .filter(p => p.impressions >= 10)
          .sort((a, b) => a.ctr - b.ctr)
          .slice(0, 5);

        // CTR 높은데 조회수 낮은 글 TOP5 (impressions >= 10, CTR >= avgCTR, views < avgViews)
        const highCtrLowViewsPosts = [...postsWithCtr]
          .filter(p => p.impressions >= 10 && p.ctr >= avgCtrNum && (p.postViews || 0) < avgViews)
          .sort((a, b) => b.ctr - a.ctr)
          .slice(0, 5);

        const trendData = last7Days.map(date => ({
          date: date.substring(5), // MM-DD
          views: viewsByDate[date]
        }));

        const hourData = Object.keys(viewsByHour).map(hour => {
          const h = parseInt(hour, 10);
          const data = viewsByHour[h];
          return {
            hour: `${h}시`,
            avgViews: data.count > 0 ? Math.round(data.views / data.count) : 0
          };
        });

        setStats({
          totalViews,
          avgCTR,
          topPosts,
          lowCtrPosts,
          highCtrLowViewsPosts,
          trendData,
          hourData
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview Cards */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Total Views</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Average CTR</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.avgCTR}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 7 Days Trend */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-6">최근 7일 조회수 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Publish Hour Performance */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-6">발행 시간대별 평균 조회수</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="avgViews" fill="#818cf8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Posts */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-6">인기글 TOP 5 (조회수 기준)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 font-medium text-gray-500 text-sm">Rank</th>
                <th className="pb-3 font-medium text-gray-500 text-sm">Title</th>
                <th className="pb-3 font-medium text-gray-500 text-sm text-right">Views</th>
                <th className="pb-3 font-medium text-gray-500 text-sm text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.topPosts.map((post: any, index: number) => {
                const ctr = post.ctr.toFixed(2);
                return (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-900 w-12">{index + 1}</td>
                    <td className="py-4 text-sm text-gray-900 font-medium">{post.title}</td>
                    <td className="py-4 text-sm text-gray-900 text-right">{post.postViews || 0}</td>
                    <td className="py-4 text-sm text-gray-500 text-right">{ctr}%</td>
                  </tr>
                );
              })}
              {stats.topPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low CTR Posts */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest">CTR 낮은 글 TOP 5</h3>
            <p className="text-xs text-gray-500 mt-1">노출수 10회 이상 기준. 썸네일이나 제목 개선이 필요할 수 있습니다.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-medium text-gray-500 text-sm">Title</th>
                  <th className="pb-3 font-medium text-gray-500 text-sm text-right">CTR</th>
                  <th className="pb-3 font-medium text-gray-500 text-sm text-right">Imp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.lowCtrPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm text-gray-900 font-medium line-clamp-1">{post.title}</td>
                    <td className="py-4 text-sm text-red-600 font-medium text-right">{post.ctr.toFixed(2)}%</td>
                    <td className="py-4 text-sm text-gray-500 text-right">{post.impressions}</td>
                  </tr>
                ))}
                {stats.lowCtrPosts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">조건에 맞는 데이터가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* High CTR Low Views Posts */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest">CTR 높고 조회수 낮은 글 TOP 5</h3>
            <p className="text-xs text-gray-500 mt-1">평균 CTR 이상 & 평균 조회수 미만. 노출 위치 개선이 필요할 수 있습니다.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-medium text-gray-500 text-sm">Title</th>
                  <th className="pb-3 font-medium text-gray-500 text-sm text-right">CTR</th>
                  <th className="pb-3 font-medium text-gray-500 text-sm text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.highCtrLowViewsPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm text-gray-900 font-medium line-clamp-1">{post.title}</td>
                    <td className="py-4 text-sm text-emerald-600 font-medium text-right">{post.ctr.toFixed(2)}%</td>
                    <td className="py-4 text-sm text-gray-500 text-right">{post.postViews || 0}</td>
                  </tr>
                ))}
                {stats.highCtrLowViewsPosts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">조건에 맞는 데이터가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
