import { useState, useCallback } from 'react';
import { Task } from '../models';

export type RarityKey = 'N' | 'R' | 'SR' | 'UR' | 'L';

export interface RarityInfo {
  key: RarityKey;
  label: string;
  xpMult: number;
  prob: number;
  emberColor: string;
  confColor: string[];
  lightningCount: number;
}

export interface GachaResult {
  task: Task;
  rarity: string;
  rarityKey: RarityKey;
  xp: number;
  history: GachaHistoryItem;
}

export interface GachaHistoryItem {
  name: string;
  desc: string;
  rarity: string;
  rkey: RarityKey;
  xp: number;
  time: string;
}

const API_BASE = 'http://localhost:5000/api';

export function useGachaController() {
  const [isLoading, setIsLoading] = useState(false);
  const [pullCount, setPullCount] = useState(0);
  const [gachaHistory, setGachaHistory] = useState<GachaHistoryItem[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // ガチャを実行
  const pullGacha = useCallback(async (availableTasks: Task[]) => {
    if (availableTasks.length === 0) {
      throw new Error('プール内にタスクがありません');
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/gacha/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableTasks }),
      });

      if (!response.ok) {
        throw new Error('ガチャに失敗しました');
      }

      const data: GachaResult = await response.json();
      setPullCount(c => c + 1);
      setGachaHistory(h => [data.history, ...h]);
      setCurrentTask(data.task);

      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // タスク完了
  const completeTask = useCallback(async (task: Task, xp: number) => {
    try {
      await fetch(`${API_BASE}/gacha/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: task.name, xp }),
      });

      setTotalXp(t => t + xp);
      setCurrentTask(null);
    } catch (error) {
      console.error('タスク完了に失敗:', error);
      throw error;
    }
  }, []);

  // ガチャ履歴を取得
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/gacha/history`);
      if (!response.ok) throw new Error('履歴取得に失敗しました');
      const data: GachaHistoryItem[] = await response.json();
      setGachaHistory(data);
    } catch (error) {
      console.error('履歴取得エラー:', error);
    }
  }, []);

  return {
    pullCount,
    gachaHistory,
    totalXp,
    currentTask,
    isLoading,
    pullGacha,
    completeTask,
    setCurrentTask,
    fetchHistory,
  };
}
