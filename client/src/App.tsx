export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">S-T_MS</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            React + Vite + Tailwind のフロントと、Express + MongoDB の API 基盤
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            この雛形は、フロントエンドとバックエンドを分離した開発しやすい構成です。
            まずは MongoDB に接続して API を生やし、そのまま UI を組み込めます。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-200">Vite</span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-200">Tailwind CSS</span>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-amber-200">Express</span>
            <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-fuchsia-200">MongoDB</span>
          </div>
        </div>
      </section>
    </main>
  );
}