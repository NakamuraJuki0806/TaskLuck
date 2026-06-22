import React, { useEffect, useState } from 'react';
import { Task } from '../models';

interface GachaSettingsProps {
  tasks: Task[];
  gachaEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onTogglePool: (taskId: number) => void;
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-800' },
  mid: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: '低', color: 'bg-green-100 text-green-800' },
};

export default function GachaSettings({
  tasks,
  gachaEnabled,
  onToggleEnabled,
  onTogglePool,
}: GachaSettingsProps) {
  const poolTasks = tasks.filter(t => t.inPool);

  return (
    <div className="space-y-6">
      {/* ガチャマスタートグル */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">ガチャ有効設定</h3>
            <p className="text-sm text-gray-500 mt-1">ガチャシステムの有効/無効を管理します</p>
          </div>
          <button
            onClick={() => onToggleEnabled(!gachaEnabled)}
            className={`w-14 h-8 rounded-full transition-colors flex items-center ${
              gachaEnabled ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                gachaEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* プール管理 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">プール管理</h3>
          <p className="text-sm text-gray-500 mt-1">
            ガチャから出現するタスクを選択します（{poolTasks.length}/{tasks.length}）
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              利用可能なタスクがありません
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* チェックボックス */}
                <button
                  onClick={() => onTogglePool(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    task.inPool
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {task.inPool && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* タスク情報 */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">{task.desc}</p>
                </div>

                {/* 優先度とXP */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      PRIORITY_LABELS[task.pri].color
                    }`}
                  >
                    {PRIORITY_LABELS[task.pri].label}
                  </span>
                  <span className="text-sm font-semibold text-purple-600 whitespace-nowrap">
                    {task.xp} XP
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">ガチャ統計</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">{poolTasks.length}</div>
            <div className="text-xs text-gray-600 mt-1">プール内タスク</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-xs text-gray-600 mt-1">全タスク数</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${gachaEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {gachaEnabled ? '有効' : '無効'}
            </div>
            <div className="text-xs text-gray-600 mt-1">ガチャ状態</div>
          </div>
        </div>
      </div>
    </div>
  );
}
