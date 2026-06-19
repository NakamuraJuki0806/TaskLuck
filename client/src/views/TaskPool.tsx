import React from 'react';
import { Task } from '../models';

interface TaskPoolProps {
  tasks: Task[];
  currentTaskId?: number;
  onTogglePool: (taskId: number) => void;
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-800' },
  mid: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: '低', color: 'bg-green-100 text-green-800' },
};

export default function TaskPool({
  tasks,
  currentTaskId,
  onTogglePool,
}: TaskPoolProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">プール内のタスク</h3>
        <p className="text-xs text-gray-500 mt-1">{tasks.length}件</p>
      </div>

      <div className="divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            プール内にタスクがありません
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
            >
              {/* トグルスイッチ */}
              <button
                onClick={() => onTogglePool(task.id)}
                disabled={currentTaskId === task.id}
                className="w-10 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>

              {/* タスク情報 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {task.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">{task.desc}</p>
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
                <span className="text-sm font-semibold text-purple-600">
                  {task.xp} XP
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
