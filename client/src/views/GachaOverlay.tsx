import React, { useEffect, useState, useRef } from 'react';
import { GachaResult, RarityKey } from '../controllers/useGachaController';
import { useGachaEffects } from '../controllers/useGachaEffects';

interface GachaOverlayProps {
  result: GachaResult;
  speedMode: 'normal' | 'fast' | 'skip';
  onClose: () => void;
}

const RARITY_COLORS: Record<RarityKey, { bg: string; border: string; text: string; emoji: string; emberColor: string; confColor: string[] }> = {
  N: {
    bg: 'from-gray-400',
    border: 'border-gray-400',
    text: 'text-gray-700',
    emoji: '⚪',
    emberColor: '#9ca3af',
    confColor: ['#9ca3af', '#e5e7eb', '#6b7280'],
  },
  R: {
    bg: 'from-blue-400',
    border: 'border-blue-400',
    text: 'text-blue-700',
    emoji: '🔵',
    emberColor: '#3b82f6',
    confColor: ['#3b82f6', '#93c5fd', '#1d4ed8'],
  },
  SR: {
    bg: 'from-purple-400',
    border: 'border-purple-400',
    text: 'text-purple-700',
    emoji: '🟣',
    emberColor: '#a855f7',
    confColor: ['#a855f7', '#d8b4fe', '#7e22ce'],
  },
  UR: {
    bg: 'from-orange-400',
    border: 'border-orange-400',
    text: 'text-orange-700',
    emoji: '🟠',
    emberColor: '#f97316',
    confColor: ['#f97316', '#fed7aa', '#c2410c'],
  },
  L: {
    bg: 'from-yellow-300',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    emoji: '⭐',
    emberColor: '#f59e0b',
    confColor: ['#f59e0b', '#fde68a', '#d97706', '#fff', '#fef9c3'],
  },
};

export default function GachaOverlay({ result, speedMode, onClose }: GachaOverlayProps) {
  const [stage, setStage] = useState(0);
  const [xpDisplay, setXpDisplay] = useState(0);
  const [baseColor, setBaseColor] = useState('#000');
  
  const rarity = result.rarityKey;
  const colors = RARITY_COLORS[rarity];
  
  const effects = useGachaEffects();
  const xpIntervalRef = useRef<number | null>(null);
  const timerRefsRef = useRef<number[]>([]);

  // アニメーションタイミング制御
  useEffect(() => {
    const speeds = {
      normal: { stage0: 1400, stage1: 2200, stage3: 3000 },
      fast: { stage0: 500, stage1: 900, stage3: 1200 },
      skip: { stage0: 0, stage1: 0, stage3: 100 },
    };

    const timings = speeds[speedMode];

    if (speedMode === 'skip') {
      setStage(3);
      setBaseColor(`base-${rarity.toLowerCase()}`);
      return;
    }

    const timers = [
      setTimeout(() => {
        setStage(1);
        effects.startEmbers(colors.emberColor, 100);
      }, timings.stage0),
      setTimeout(() => setStage(2), timings.stage0 + 200),
      setTimeout(() => {
        setStage(3);
        effects.fireConfetti(colors.confColor, 150);
      }, timings.stage1),
    ];

    timerRefsRef.current = timers as any;

    return () => timerRefsRef.current.forEach(t => clearTimeout(t));
  }, [speedMode, rarity, colors, effects]);

  // XP カウントアップアニメーション
  useEffect(() => {
    if (stage !== 3) return;

    let current = 0;
    const target = result.xp;
    
    if (xpIntervalRef.current) clearInterval(xpIntervalRef.current);
    
    xpIntervalRef.current = window.setInterval(() => {
      current = Math.min(target, current + Math.ceil(target / 15));
      setXpDisplay(current);
      if (current >= target && xpIntervalRef.current) {
        clearInterval(xpIntervalRef.current);
      }
    }, 20);

    return () => {
      if (xpIntervalRef.current) clearInterval(xpIntervalRef.current);
    };
  }, [stage, result.xp]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      effects.stopEmbers();
      timerRefsRef.current.forEach(t => clearTimeout(t));
      if (xpIntervalRef.current) clearInterval(xpIntervalRef.current);
    };
  }, [effects]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Canvas レイヤー */}
      <canvas
        ref={effects.emberCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />
      <canvas
        ref={effects.confettiCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      />
      <canvas
        ref={effects.lightningCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Aura & Shockwave */}
      <div id="ov-aura" className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" />
      <div id="ov-shockwave" className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" />

      {/* ステージ 0: リング回転 */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
          stage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 border-4 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-white text-sm tracking-widest uppercase opacity-60">
            レアリティを判定中...
          </p>
        </div>
      </div>

      {/* ステージ 1: 沸騰 */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
          stage === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="text-8xl animate-bounce">🍲</div>
          <div className="text-white text-xl font-bold tracking-widest">
            <div className="animate-pulse">鍋が激しく沸騰中...</div>
          </div>
        </div>
      </div>

      {/* ステージ 2: ルーレット（スキップ） */}
      {stage === 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
          {/* ルーレット表示 */}
        </div>
      )}

      {/* ステージ 3: 結果表示 */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
          stage === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="text-center max-w-lg space-y-4">
          {/* レアリティバッジ */}
          <div className="inline-block">
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${colors.border} bg-black`}
              style={{
                animation: 'gs3pop 0.4s 0.1s both',
              }}
            >
              <span className="text-2xl">{colors.emoji}</span>
              <span className={`text-xs font-bold tracking-widest uppercase ${colors.text}`}>
                {result.rarity}
              </span>
            </div>
          </div>

          {/* タスク名 */}
          <h2
            className="text-4xl font-black text-white mt-6"
            style={{
              animation: 'gs3sl 0.5s 0.25s both',
            }}
          >
            {result.task.name}
          </h2>

          {/* タスク説明 */}
          <p
            className="text-white text-opacity-60 text-sm leading-relaxed"
            style={{
              animation: 'gs3sl 0.5s 0.35s both',
            }}
          >
            {result.task.desc}
          </p>

          {/* XP表示 */}
          <div
            className="mt-8 pt-6 border-t border-white border-opacity-10"
            style={{
              animation: 'gs3sl 0.5s 0.45s both',
            }}
          >
            <div className="text-white text-opacity-50 text-xs tracking-widest mb-2">
              獲得XP
            </div>
            <div className={`text-6xl font-black ${colors.text}`}>{xpDisplay}</div>
          </div>

          {/* クローズボタン */}
          <button
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
            style={{
              animation: 'gs3sl 0.5s 0.65s both',
            }}
          >
            OK
          </button>
        </div>
      </div>

      {/* スキップボタン */}
      <button
        onClick={onClose}
        className="absolute bottom-6 right-6 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-15 text-white text-xs rounded-lg hover:bg-opacity-20 transition-colors z-50"
      >
        スキップ ▶▶
      </button>

      <style>{`
        @keyframes gs3pop {
          from {
            opacity: 0;
            transform: scale(0.4) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes gs3sl {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gglpulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
