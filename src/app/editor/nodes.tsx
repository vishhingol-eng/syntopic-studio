import { Handle, NodeProps, Position } from '@xyflow/react';
import type { WorkflowNodeData } from './editor-types';

const portTone: Record<string, string> = {
  exec: 'bg-accent',
  data: 'bg-slate-300',
  control: 'bg-violet-400',
  signal: 'bg-amber-400',
  context: 'bg-cyan-400',
  memory: 'bg-emerald-400',
  knowledge: 'bg-teal-400',
  prompt: 'bg-indigo-300',
  text: 'bg-slate-200',
  json: 'bg-slate-300',
  object: 'bg-slate-300',
  table: 'bg-slate-300',
  file: 'bg-slate-300',
  document: 'bg-slate-300',
  vector: 'bg-cyan-300',
  embedding: 'bg-cyan-300',
  entity: 'bg-emerald-300',
  relationship: 'bg-emerald-300',
  error: 'bg-red-400',
  event: 'bg-amber-300',
  approval: 'bg-amber-300',
  state: 'bg-slate-300',
};

const toneClass = (type: string) => portTone[type] ?? 'bg-slate-300';

export function WorkflowNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  const widthClass = data.shape === 'group' ? 'w-[320px]' : data.shape === 'diamond' ? 'w-[280px]' : 'w-[292px]';
  const cardShape = data.shape === 'pill' ? 'rounded-[999px]' : data.shape === 'diamond' ? 'rounded-[24px]' : 'rounded-[22px]';
  const accentBorder = selected ? `rgba(108,140,255,0.52)` : `${data.accent}55`;
  const accentFill = `${data.accent}1A`;

  return (
    <div
      className={`group relative ${widthClass} border bg-[rgba(18,25,35,0.96)] shadow-[0_18px_40px_rgba(0,0,0,0.38)] backdrop-blur-sm ${cardShape}`}
      style={{ borderColor: accentBorder }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3"
        style={{ background: `linear-gradient(180deg, ${accentFill}, rgba(255,255,255,0.01))` }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 text-sm font-semibold text-white"
            style={{ backgroundColor: `${data.accent}22`, color: '#FFFFFF' }}
          >
            {data.icon}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-slate-100">{data.title}</div>
            <div className="truncate text-[11px] text-slate-400">{data.category} • {data.nodeType}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {data.breakpoint ? (
            <span className="rounded-full border border-amber-400/35 bg-amber-400/15 px-2 py-1 text-amber-200">bp</span>
          ) : null}
          <span
            className={`rounded-full px-2 py-1 ${selected ? 'bg-accent/15 text-white' : 'bg-white/5 text-slate-300'}`}
          >
            {data.runtime.status}
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="mb-3 text-[12px] leading-5 text-slate-400">{data.description}</p>

        <div className="space-y-3">
          {data.inputs.length > 0 ? (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Inputs</div>
              <div className="space-y-2">
                {data.inputs.map((port, index) => (
                  <div key={port.id} className="relative flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-[12px] text-slate-200">
                    <Handle
                      id={port.id}
                      type="target"
                      position={Position.Left}
                      className={`!left-[-6px] !h-3 !w-3 !border-white/20 ${toneClass(port.type)}`}
                      style={{ top: 18 + index * 0 }}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{port.label}</span>
                      <span className="truncate text-[10px] text-slate-500">{port.type}{port.required ? ' • required' : ''}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{port.multiple ? 'multi' : 'single'}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {data.outputs.length > 0 ? (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Outputs</div>
              <div className="space-y-2">
                {data.outputs.map((port, index) => (
                  <div key={port.id} className="relative flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-[12px] text-slate-200">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{port.label}</span>
                      <span className="truncate text-[10px] text-slate-500">{port.type}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{port.multiple ? 'multi' : 'single'}</span>
                    <Handle
                      id={port.id}
                      type="source"
                      position={Position.Right}
                      className={`!right-[-6px] !h-3 !w-3 !border-white/20 ${toneClass(port.type)}`}
                      style={{ top: 18 + index * 0 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[11px] text-slate-400">
        <span className="font-mono">{data.runtime.version ?? 'v1'}</span>
        <span>{data.runtime.tokens ? `${data.runtime.tokens} tokens` : 'ready'}</span>
      </div>
    </div>
  );
}
