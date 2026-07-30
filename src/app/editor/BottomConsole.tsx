import { useMemo } from 'react';
import { useEditorStore } from './editor-store';
import type { ConsoleTab } from './editor-types';

const tabs: ConsoleTab[] = ['console', 'timeline', 'logs', 'events', 'errors', 'performance', 'cost', 'tokens', 'debug'];

const levelClass: Record<string, string> = {
  info: 'text-slate-300',
  success: 'text-emerald-300',
  warn: 'text-amber-300',
  error: 'text-red-300',
  debug: 'text-cyan-300',
};

export default function BottomConsole() {
  const activeConsoleTab = useEditorStore((state) => state.activeConsoleTab);
  const setActiveConsoleTab = useEditorStore((state) => state.setActiveConsoleTab);
  const consoleEntries = useEditorStore((state) => state.consoleEntries);
  const runtimeStatus = useEditorStore((state) => state.runtimeStatus);
  const nodes = useEditorStore((state) => state.nodes);
  const edges = useEditorStore((state) => state.edges);

  const metrics = useMemo(() => ({
    nodes: nodes.length,
    edges: edges.length,
    active: nodes.filter((node) => node.data.runtime.status === 'running').length,
    waiting: nodes.filter((node) => node.data.runtime.status === 'waiting').length,
    failed: nodes.filter((node) => node.data.runtime.status === 'failed').length,
  }), [nodes, edges]);

  return (
    <footer className="flex h-[280px] min-h-0 flex-col border-t border-white/6 bg-[rgba(14,20,28,0.98)] shadow-[0_-12px_30px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveConsoleTab(tab)}
              className={`rounded-xl px-3 py-2 text-[12px] font-semibold capitalize transition ${activeConsoleTab === tab ? 'bg-accent/16 text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[12px] text-slate-400">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">{runtimeStatus.toUpperCase()}</span>
          <span>{metrics.nodes} nodes</span>
          <span>{metrics.edges} edges</span>
          <span>{metrics.active} active</span>
          <span>{metrics.waiting} waiting</span>
          <span>{metrics.failed} failed</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-h-0 overflow-y-auto p-4">
          <div className="rounded-3xl border border-white/6 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{activeConsoleTab}</div>
                <div className="text-[14px] font-semibold text-slate-100">Runtime console</div>
              </div>
              <div className="text-[11px] text-slate-500">PCOS / LangGraph / SDK agnostic</div>
            </div>

            <div className="space-y-2 font-mono text-[12px] leading-6">
              {consoleEntries.slice(-10).map((entry) => (
                <div key={entry.id} className="flex gap-3 rounded-2xl border border-white/6 bg-black/10 px-3 py-2">
                  <div className="w-20 shrink-0 text-slate-500">{entry.time}</div>
                  <div className={`w-20 shrink-0 uppercase tracking-[0.16em] ${levelClass[entry.level]}`}>{entry.level}</div>
                  <div className="w-20 shrink-0 text-slate-500">{entry.scope}</div>
                  <div className="min-w-0 flex-1 text-slate-200">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-0 border-l border-white/6 p-4">
          <div className="rounded-3xl border border-white/6 bg-white/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Debug information</div>
            <div className="mt-3 space-y-3 text-[12px] text-slate-300">
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                <div className="text-slate-500">Execution mode</div>
                <div className="mt-1 font-semibold text-slate-100">{runtimeStatus}</div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                <div className="text-slate-500">Trace</div>
                <div className="mt-1 font-semibold text-slate-100">Live event stream enabled</div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                <div className="text-slate-500">Cost / Tokens</div>
                <div className="mt-1 font-semibold text-slate-100">Tracked per run</div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                <div className="text-slate-500">Replay</div>
                <div className="mt-1 font-semibold text-slate-100">Snapshot-ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
