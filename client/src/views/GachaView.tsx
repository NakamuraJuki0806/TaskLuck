import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../models';
import { useGachaController, RarityKey, GachaResult } from '../controllers/useGachaController';
import GachaOverlay from './GachaOverlay';
import GachaIdle from './GachaIdle';
import GachaHistory from './GachaHistory';
import TaskPool from './TaskPool';

interface GachaViewProps {
  tasks: Task[];
  onTaskComplete: (taskId: number, xp: number) => Promise<void>;
  onTaskStatusChange: (taskId: number, status: string) => void;
}

export default function GachaView({
  tasks,
  onTaskComplete,
  onTaskStatusChange,
}: GachaViewProps) {
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast' | 'skip'>('normal');
  const [showOverlay, setShowOverlay] = useState(false);
  const [gachaResult, setGachaResult] = useState<GachaResult | null>(null);
  const [poolTasks, setPoolTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'idle' | 'pool' | 'history'>('idle');
  const [totalXp, setTotalXp] = useState(0);

  const {
    pullCount,
    gachaHistory,
    currentTask,
    isLoading,
    pullGacha,
    completeTask,
    setCurrentTask,
    fetchHistory,
  } = useGachaController();

  // プール内のタスクを更新
  useEffect(() => {
    const available = tasks.filter(t => t.st === 'pending' && t.inPool);
    setPoolTasks(available);
  }, [tasks]);

  // ガチャを実行
  const handlePullGacha = async () => {
    if (poolTasks.length === 0) {
      alert('プール内にタスクがありません');
      return;
    }

    try {
      const result = await pullGacha(poolTasks);
      setGachaResult(result);
      setShowOverlay(true);
    } catch (error) {
      alert('ガチャ実行に失敗しました');
      console.error(error);
    }
  };

  // タスク完了
  const handleCompleteTask = async () => {
    if (!currentTask) return;

    try {
      const result = gachaResult || { xp: currentTask.xp };
      await completeTask(currentTask, result.xp);
      await onTaskComplete(currentTask.id, result.xp);
      setCurrentTask(null);
      setGachaResult(null);
    } catch (error) {
      alert('タスク完了に失敗しました');
    }
  };

  // タスクをプールに追加/除外
  const handleTogglePool = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && currentTask?.id !== taskId) {
      const newInPool = !task.inPool;
      // 親コンポーネントで処理
      onTaskStatusChange(taskId, `${newInPool ? 'pool_add' : 'pool_remove'}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* ガチャオーバーレイ */}
      {showOverlay && gachaResult && (
        <GachaOverlay
          result={gachaResult}
          speedMode={speedMode}
          onClose={() => setShowOverlay(false)}
        />
      )}

      {/* タブナビゲーション */}
      <div className="flex gap-2 border-b border-gray-200 px-4">
        <button
          onClick={() => setActiveTab('idle')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'idle'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          ガチャ
        </button>
        <button
          onClick={() => setActiveTab('pool')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pool'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          プール管理
        </button>
        <button
          onClick={() => {
            setActiveTab('history');
            fetchHistory();
          }}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          履歴
        </button>
      </div>

      <div className="px-4">
        {/* ガチャアイドル画面 */}
        {activeTab === 'idle' && (
          <GachaIdle
            currentTask={currentTask}
            pullCount={pullCount}
            isLoading={isLoading}
            speedMode={speedMode}
            onPullGacha={handlePullGacha}
            onCompleteTask={handleCompleteTask}
            onSpeedModeChange={setSpeedMode}
            lastRarity={gachaHistory[0]?.rarity || '—'}
          />
        )}

        {/* プール管理 */}
        {activeTab === 'pool' && (
          <TaskPool
            tasks={poolTasks}
            currentTaskId={currentTask?.id}
            onTogglePool={handleTogglePool}
          />
        )}

        {/* ガチャ履歴 */}
        {activeTab === 'history' && (
          <GachaHistory history={gachaHistory} />
        )}
      </div>
    </div>
  );
}
