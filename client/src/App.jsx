import { useEffect, useState } from 'react';

const apiBaseUrl = '/api';

export default function App() {
  const [health, setHealth] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/health`);
        const data = await response.json();
        setHealth(data.status ?? 'unknown');
        setMessage(data.message ?? 'No message received');
      } catch (error) {
        setHealth('error');
        setMessage(error.message);
      }
    };

    loadHealth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          React + Vite + Tailwind + Express + MongoDB
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          TaskLuck の開発環境が動く状態です。
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          ルートで <span className="font-semibold text-white">npm run dev</span> を実行すると、フロントエンドとバックエンドが同時に起動します。
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Backend Health</p>
            <p className="mt-3 text-2xl font-semibold text-white">{health}</p>
            <p className="mt-2 text-slate-300">{message}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Next Step</p>
            <p className="mt-3 text-2xl font-semibold text-white">MongoDB を接続</p>
            <p className="mt-2 text-slate-300">server/.env に MONGODB_URI を設定すると、DB 接続が有効になります。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
