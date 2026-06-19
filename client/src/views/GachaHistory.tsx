import React from 'react';
import { GachaHistoryItem } from '../controllers/useGachaController';

interface GachaHistoryProps {
  history: GachaHistoryItem[];
}

const RARITY_INFO: Record<string, { emoji: string; bg: string; text: string }> = {
  NORMAL: { emoji: '⚪', bg: 'bg-gray-100', text: 'text-gray-700' },
  RARE: { emoji: '🔵', bg: 'bg-blue-100', text: 'text-blue-700' },
  'SUPER RARE': { emoji: '🟣', bg: 'bg-purple-100', text: 'text-purple-700' },
  'ULTRA RARE': { emoji: '🟠', bg: 'bg-orange-100', text: 'text-orange-700' },
  LEGENDARY: { emoji: '⭐', bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

export default function GachaHistory({ history }: GachaHistoryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">ガチャ履歴</h3>
        <p className="text-xs text-gray-500 mt-1">{history.length}件</p>
      </div>

      <div className="divide-y divide-gray-200">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            ガチャの履歴がありません
          </div>
        ) : (
          history.slice(0, 20).map((item, idx) => {
            const info = RARITY_INFO[item.rarity] || { emoji: '?', bg: 'bg-gray-100', text: 'text-gray-700' };
            return (
              <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                {/* レアリティバー */}
                <div className={`w-1 h-12 rounded-full flex-shrink-0 ${info.bg}`}></div>

                {/* 情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{info.emoji}</span>
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>

                {/* XP */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-sm font-bold ${info.text}`}>
                    {item.rarity}
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    +{item.xp} XP
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
