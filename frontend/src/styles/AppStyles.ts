// src/styles/AppStyles.ts

export const styles = {
  container: "min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 selection:bg-cyan-500 selection:text-white",

  header: "w-full max-w-3xl mb-8 flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4",

  title: "text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500",

  subtitle: "text-slate-400 text-xs mt-1",

  tabContainer: "flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium",

  tabButton: "px-4 py-2 rounded-lg transition-all cursor-pointer",
  tabActive: "bg-cyan-600 text-white shadow-md",
  tabInactive: "text-slate-400 hover:text-slate-200",

  card: "bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6",

  label: "block text-xs font-semibold uppercase tracking-wider text-slate-400",

  input: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono",

  buttonPrimary: "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-950",

  resultBox: "p-4 bg-slate-950 border border-slate-800 rounded-xl",

  resultLabel: "text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1",

  resultText: "text-slate-200 font-mono text-sm break-all",

  regButton: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer border border-slate-700 text-sm",

  freezeButton: "flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-rose-950 text-sm",

  regStatusFrozen: "p-4 rounded-xl border bg-rose-950/40 border-rose-900 text-rose-300",
  regStatusActive: "p-4 rounded-xl border bg-emerald-950/40 border-emerald-900 text-emerald-300",

  regMessage: "p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 break-all",
};
