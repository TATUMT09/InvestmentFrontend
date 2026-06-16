'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface AiAnalysisData {
  summary: string;
}

export default function AiTahlilBlock() {
  const [data, setData] = useState<AiAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/api/ai-analysis/dashboard')
      .then(response => {
        setData(response.data);
        setError(false);
      })
      .catch(err => {
        console.error('AI API xatosi:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,0,0,0.2)", color: "#f87171" }}>
        ⚠️ AI tahlilini olishda xatolik
      </div>
    );
  }

  // Summary ni qatorlarga ajratamiz
  const lines = data.summary.split('\n').filter(line => line.trim());

  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <span className="text-base">🤖</span>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(100,130,200,0.8)" }}>
          AI Tahlili
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>
          Live
        </span>
      </div>

      <div className="space-y-2 text-xs" style={{ color: "rgba(200,220,255,0.75)", lineHeight: 1.5 }}>
        {lines.map((line, idx) => {
          // Sarlavhalar (📊, ⚠️, 💰, 📍, ✅)
          if (line.match(/[📊⚠️💰📍✅]/)) {
            return (
              <div key={idx} className="font-semibold mt-2 first:mt-0" style={{ color: "#c9a84c" }}>
                {line}
              </div>
            );
          }
          // Raqamli tavsiyalar (1., 2., 3., 4.)
          if (line.match(/^\d+\./)) {
            return (
              <div key={idx} className="flex gap-2 ml-1">
                <span className="text-blue-400 font-bold">{line.match(/^\d+/)?.[0]}.</span>
                <span>{line.replace(/^\d+\.\s*/, '')}</span>
              </div>
            );
          }
          // Oddiy matn
          if (line.trim()) {
            return (
              <p key={idx} className="leading-relaxed">
                {line}
              </p>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}