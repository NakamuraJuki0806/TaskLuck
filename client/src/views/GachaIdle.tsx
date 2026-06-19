import React from 'react';

interface GachaIdleProps {
  currentTask: any | null;
  pullCount: number;
  isLoading: boolean;
  speedMode: 'normal' | 'fast' | 'skip';
  onPullGacha: () => void;
  onCompleteTask: () => void;
  onSpeedModeChange: (mode: 'normal' | 'fast' | 'skip') => void;
  lastRarity: string;
}

export default function GachaIdle({
  currentTask,
  pullCount,
  isLoading,
  speedMode,
  onPullGacha,
  onCompleteTask,
  onSpeedModeChange,
  lastRarity,
}: GachaIdleProps) {
  return (
    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
      {currentTask ? (
        // 対応中のタスク表示
        <div>
          <div className="mb-6">
            <div className="inline-block bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-4">
              <span className="text-sm text-purple-600">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                対応中
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">{currentTask.name}</h2>
          <p className="text-gray-600 text-sm mb-6">{currentTask.desc}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-xs text-gray-500 mb-1">予定XP</div>
            <div className="text-3xl font-bold text-purple-600">+{currentTask.xp || 0} XP</div>
          </div>

          <button
            onClick={onCompleteTask}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            タスク完了
          </button>
        </div>
      ) : (
        // ガチャ待機画面
        <div>
          <div className="text-6xl mb-4 animate-bounce">🍲</div>

          <h2 className="text-2xl font-bold mb-2">闇鍋ガチャ</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            タスクから何が飛び出すかは運次第...
            <br />
            ガチャを回してタスクを引き当てよう！
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-600">
              総回数: <span className="font-bold text-purple-600">{pullCount}</span>
            </span>
          </div>

          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2">最後の結果</div>
            <div className="text-lg font-bold text-purple-600">{lastRarity}</div>
          </div>

          {/* スピードモード選択 */}
          <div className="flex gap-2 justify-center mb-8">
            {(['normal', 'fast', 'skip'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onSpeedModeChange(mode)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  speedMode === mode
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {mode === 'normal' && '標準'}
                {mode === 'fast' && '高速'}
                {mode === 'skip' && 'スキップ'}
              </button>
            ))}
          </div>

          <button
            onClick={onPullGacha}
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '処理中...' : 'ガチャを回す'}
          </button>
        </div>
      )}
    </div>
  );
}
