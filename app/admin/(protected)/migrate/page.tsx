'use client';

import React, { useState } from 'react';
import { db } from '../../../../src/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const VALID_CATEGORIES = ['환율', 'ETF', '경제 기초', '미국 증시', '세금/지원금'];

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runMigration = async () => {
    setLoading(true);
    setLogs(['Starting migration...']);
    
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      let updatedCount = 0;

      for (const document of querySnapshot.docs) {
        const data = document.data();
        let updated = false;
        const updates: any = {};

        // 1. Migrate Category
        if (!VALID_CATEGORIES.includes(data.category)) {
          let newCategory = '경제 기초'; // Default fallback
          const oldCat = (data.category || '').toLowerCase();
          if (oldCat.includes('환율') || oldCat.includes('exchange')) newCategory = '환율';
          else if (oldCat.includes('etf')) newCategory = 'ETF';
          else if (oldCat.includes('미국') || oldCat.includes('증시')) newCategory = '미국 증시';
          else if (oldCat.includes('세금') || oldCat.includes('지원금')) newCategory = '세금/지원금';
          
          updates.category = newCategory;
          updated = true;
        }

        // 2. Set default language if missing
        if (!data.language) {
          updates.language = 'ko';
          updated = true;
        }

        // 3. Set default flowType if missing
        if (data.flowType === undefined) {
          updates.flowType = '';
          updated = true;
        }

        if (updated) {
          setLogs(prev => [...prev, `Updating post ${document.id} (${data.title})`]);
          await updateDoc(doc(db, 'posts', document.id), updates);
          updatedCount++;
        }
      }
      
      setLogs(prev => [...prev, `Migration complete. Updated ${updatedCount} posts.`]);
    } catch (error: any) {
      setLogs(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Migration</h1>
      <button 
        onClick={runMigration} 
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run Migration'}
      </button>
      
      <div className="mt-8 bg-gray-100 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}
