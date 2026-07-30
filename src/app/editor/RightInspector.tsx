import { useMemo } from 'react';
import { useEditorStore } from './editor-store';
import type { WorkflowNodeData } from './editor-types';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{children}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

const inspectorTabs = ['general', 'properties', 'prompt', 'memory', 'knowledge', 'advanced', 'debug'] as const;

export default function RightInspector() {
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const selectedNode = useEditorStore((state) => state.nodes.find((node) => node.id === state.selectedNodeId) ?? null);
  const activeInspectorTab = useEditorStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useEditorStore((state) => state.setActiveInspectorTab);
  const updateSelectedNodeData = useEditorStore((state) => state.updateSelectedNodeData);
  const toggleBreakpoint = useEditorStore((state) => state.toggleBreakpoint);
  const consoleEntries = useEditorStore((state) => state.consoleEntries);

  const runtimeSummary = useMemo(() => {
    if (!selectedNode) return null;
    const runtime = selectedNode.data.runtime;
    return `${runtime.status}${runtime.step ? ` • ${runtime.step}` : ''}`;
  }, [selectedNode]);

  const updateConfig = (patch: Record<string, unknown>) => {
    if (!selectedNode) return;
    updateSelectedNodeData({ config: { ...selectedNode.data.config, ...patch } });
  };

  if (!selectedNode) {
    return (
      <aside className="flex h-full w-[380px] min-h-0 flex-col border-l border-white/6 bg-[rgba(16,22,30,0.98)]">
        <div className="border-b border-white/6 px-5 py-4">
          <SectionLabel>Inspector</SectionLabel>
          <div className="mt-1 text-[16px] font-semibold text-slate-100">No node selected</div>
          <div className="mt-1 text-[12px] text-slate-500">Select a node to configure its runtime, prompt, memory, and debug state.</div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center text-[13px] text-slate-500">
          Click any node on the canvas to inspect and edit it.
        </div>
      </aside>
    );
  }

  const data = selectedNode.data as WorkflowNodeData;

  return (
    <aside className="flex h-full w-[380px] min-h-0 flex-col border-l border-white/6 bg-[rgba(16,22,30,0.98)]">
      <div className="border-b border-white/6 px-5 py-4">
        <SectionLabel>Inspector</SectionLabel>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <div className="text-[16px] font-semibold text-slate-100">{data.title}</div>
            <div className="text-[12px] text-slate-500">{data.category} • {data.nodeType}</div>
          </div>
          <button
            type="button"
            onClick={() => toggleBreakpoint(selectedNode.id)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${data.breakpoint ? 'border-amber-400/35 bg-amber-400/15 text-amber-100' : 'border-white/8 bg-white/[0.03] text-slate-300'}`}
          >
            Breakpoint
          </button>
        </div>
      </div>

      <div className="border-b border-white/6 px-3 py-3">
        <div className="grid grid-cols-2 gap-2">
          {inspectorTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveInspectorTab(tab)}
              className={`rounded-xl px-3 py-2 text-[12px] font-semibold capitalize transition ${activeInspectorTab === tab ? 'bg-accent/16 text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {activeInspectorTab === 'general' ? (
          <div className="space-y-4">
            <Field label="Title">
              <input
                value={data.title}
                onChange={(event) => updateSelectedNodeData({ title: event.target.value })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-accent/45"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={data.description}
                onChange={(event) => updateSelectedNodeData({ description: event.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <Field label="Runtime Binding">
              <input
                value={(data.config.runtimeBinding as string | undefined) ?? ''}
                onChange={(event) => updateConfig({ runtimeBinding: event.target.value })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <Field label="Notes">
              <textarea
                value={(data.config.notes as string | undefined) ?? ''}
                onChange={(event) => updateConfig({ notes: event.target.value })}
                rows={4}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
          </div>
        ) : null}

        {activeInspectorTab === 'properties' ? (
          <div className="space-y-4">
            <Field label="Model">
              <input
                value={(data.config.model as string | undefined) ?? ''}
                onChange={(event) => updateConfig({ model: event.target.value })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <Field label="Temperature">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={(data.config.temperature as number | undefined) ?? 0.2}
                onChange={(event) => updateConfig({ temperature: Number(event.target.value) })}
                className="w-full"
              />
            </Field>
            <Field label="Max Tokens">
              <input
                type="number"
                value={(data.config.maxTokens as number | undefined) ?? 1024}
                onChange={(event) => updateConfig({ maxTokens: Number(event.target.value) })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <Field label="Timeout (ms)">
              <input
                type="number"
                value={(data.config.timeoutMs as number | undefined) ?? 120000}
                onChange={(event) => updateConfig({ timeoutMs: Number(event.target.value) })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <Field label="Retries">
              <input
                type="number"
                value={(data.config.retries as number | undefined) ?? 0}
                onChange={(event) => updateConfig({ retries: Number(event.target.value) })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
          </div>
        ) : null}

        {activeInspectorTab === 'prompt' ? (
          <div className="space-y-4">
            <Field label="Prompt">
              <textarea
                value={(data.config.prompt as string | undefined) ?? ''}
                onChange={(event) => updateConfig({ prompt: event.target.value })}
                rows={10}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 font-mono text-[12px] leading-6 text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 text-[12px] text-slate-400">
              Prompt variables are resolved at runtime from context, memory, and upstream nodes.
            </div>
          </div>
        ) : null}

        {activeInspectorTab === 'memory' ? (
          <div className="space-y-4">
            <Field label="Memory Scope">
              <input
                value={(data.config.memoryScope as string | undefined) ?? 'workspace'}
                onChange={(event) => updateConfig({ memoryScope: event.target.value })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 text-[12px] text-slate-400">
              PCOS memory integrates persistent, session, and conversation context. Use this tab to scope what the node can read and write.
            </div>
          </div>
        ) : null}

        {activeInspectorTab === 'knowledge' ? (
          <div className="space-y-4">
            <Field label="Knowledge Scope">
              <input
                value={(data.config.knowledgeScope as string | undefined) ?? 'workspace'}
                onChange={(event) => updateConfig({ knowledgeScope: event.target.value })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 text-[12px] text-slate-400">
              Attach knowledge graph sources, retrieval scopes, or semantic filters to this node.
            </div>
          </div>
        ) : null}

        {activeInspectorTab === 'advanced' ? (
          <div className="space-y-4">
            <Field label="Runtime Status">
              <select
                value={data.runtime.status}
                onChange={(event) => updateSelectedNodeData({ runtime: { ...data.runtime, status: event.target.value as WorkflowNodeData['runtime']['status'] } })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              >
                <option value="idle">idle</option>
                <option value="running">running</option>
                <option value="waiting">waiting</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
                <option value="failed">failed</option>
                <option value="selected">selected</option>
              </select>
            </Field>
            <Field label="Breakpoint">
              <button
                type="button"
                onClick={() => toggleBreakpoint(selectedNode.id)}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-left text-[13px] text-slate-200"
              >
                {data.breakpoint ? 'Enabled' : 'Disabled'}
              </button>
            </Field>
            <Field label="Version">
              <input
                value={data.runtime.version ?? 'v1'}
                onChange={(event) => updateSelectedNodeData({ runtime: { ...data.runtime, version: event.target.value } })}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-slate-100 outline-none focus:border-accent/45"
              />
            </Field>
          </div>
        ) : null}

        {activeInspectorTab === 'debug' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <SectionLabel>Runtime</SectionLabel>
              <div className="mt-2 text-[13px] font-semibold text-slate-100">{runtimeSummary}</div>
              <div className="mt-1 text-[12px] text-slate-500">Latency: {data.runtime.latencyMs ?? 0}ms • Cost: ${data.runtime.cost?.toFixed(2) ?? '0.00'} • Tokens: {data.runtime.tokens ?? 0}</div>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <SectionLabel>Recent logs</SectionLabel>
              <div className="mt-3 space-y-2">
                {consoleEntries.slice(-4).map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-white/6 bg-black/10 px-3 py-2 text-[12px] text-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-500">{entry.scope}</span>
                      <span className="text-slate-500">{entry.time}</span>
                    </div>
                    <div className="mt-1">{entry.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
