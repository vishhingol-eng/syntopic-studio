import { useMemo, useState } from 'react';
import { NODE_LIBRARY_GROUPS, NODE_PRESET_MAP } from './node-presets';
import { useEditorStore } from './editor-store';
import type { ExplorerTab, WorkflowNodeType } from './editor-types';

const explorerItems: Array<{ label: string; tab: ExplorerTab; detail: string }> = [
  { label: 'Projects', tab: 'projects', detail: '3 active' },
  { label: 'Workflows', tab: 'workflows', detail: '7 graphs' },
  { label: 'Agents', tab: 'agents', detail: '4 runtimes' },
  { label: 'Prompts', tab: 'prompts', detail: '12 templates' },
  { label: 'Tools', tab: 'tools', detail: 'MCP + APIs' },
  { label: 'Memory', tab: 'memory', detail: 'persistent context' },
  { label: 'Knowledge', tab: 'knowledge', detail: 'graph + search' },
  { label: 'Templates', tab: 'templates', detail: 'starter kits' },
  { label: 'Assets', tab: 'assets', detail: 'icons + fixtures' },
  { label: 'Deployments', tab: 'deployments', detail: '2 environments' },
];

export default function LeftExplorer() {
  const activeExplorerTab = useEditorStore((state) => state.activeExplorerTab);
  const setActiveExplorerTab = useEditorStore((state) => state.setActiveExplorerTab);
  const addNode = useEditorStore((state) => state.addNode);
  const [query, setQuery] = useState('');

  const filteredNodeTypes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return NODE_LIBRARY_GROUPS;

    return NODE_LIBRARY_GROUPS.map((group) => ({
      ...group,
      types: group.types.filter((type) => {
        const preset = NODE_PRESET_MAP.get(type);
        return preset?.title.toLowerCase().includes(term) || preset?.description.toLowerCase().includes(term) || preset?.category.toLowerCase().includes(term);
      }),
    })).filter((group) => group.types.length > 0);
  }, [query]);

  const onDragStart = (event: DragEvent<HTMLButtonElement>, type: WorkflowNodeType) => {
    event.dataTransfer.setData('application/x-syntopic-node', type);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const addPresetToCanvas = (type: WorkflowNodeType) => {
    const offsetX = 180 + Math.floor(Math.random() * 120);
    const offsetY = 120 + Math.floor(Math.random() * 360);
    addNode(type, { x: offsetX, y: offsetY });
  };

  return (
    <aside className="flex h-full min-h-0 w-[320px] flex-col border-r border-white/6 bg-[rgba(16,22,30,0.98)] shadow-panel">
      <div className="border-b border-white/6 px-4 py-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Explorer</div>
        <div className="mt-1 text-[16px] font-semibold text-slate-100">Projects & workflows</div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/6 bg-white/[0.03] p-1">
          {(['projects', 'workflows', 'agents', 'templates'] as ExplorerTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveExplorerTab(tab)}
              className={`rounded-xl px-3 py-2 text-[12px] font-semibold capitalize transition ${activeExplorerTab === tab ? 'bg-accent/16 text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {explorerItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveExplorerTab(item.tab)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${activeExplorerTab === item.tab ? 'border-accent/35 bg-accent/10' : 'border-white/6 bg-white/[0.02] hover:bg-white/[0.04]'}`}
            >
              <div>
                <div className="text-[13px] font-semibold text-slate-100">{item.label}</div>
                <div className="text-[11px] text-slate-500">{item.detail}</div>
              </div>
              <div className="text-[11px] text-slate-500">↗</div>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-white/6 bg-[rgba(255,255,255,0.02)] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Node library</div>
          <div className="mt-2 rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search nodes"
              className="w-full bg-transparent text-[13px] text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-4 space-y-4">
            {filteredNodeTypes.map((group) => (
              <div key={group.category}>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.label}</div>
                <div className="space-y-2">
                  {group.types.map((type) => {
                    const preset = NODE_PRESET_MAP.get(type)!;
                    return (
                      <button
                        key={type}
                        type="button"
                        draggable
                        onDragStart={(event) => onDragStart(event, type)}
                        onDoubleClick={() => addPresetToCanvas(type)}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-3 text-left transition hover:border-accent/30 hover:bg-white/[0.05]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 text-[13px] font-semibold text-white" style={{ backgroundColor: `${preset.accent}20` }}>
                          {preset.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-semibold text-slate-100">{preset.title}</div>
                          <div className="truncate text-[11px] text-slate-500">{preset.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
