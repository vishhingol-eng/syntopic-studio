import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import type { WorkflowEdgeData } from './editor-types';

const EDGE_STYLE: Record<WorkflowEdgeData['kind'], { stroke: string; label: string }> = {
  execution: { stroke: '#6C8CFF', label: 'exec' },
  data: { stroke: '#C7D0DE', label: 'data' },
  memory: { stroke: '#37C98A', label: 'memory' },
  knowledge: { stroke: '#36D6C0', label: 'knowledge' },
  conditional: { stroke: '#B59CFF', label: 'branch' },
  event: { stroke: '#E0A44B', label: 'event' },
};

export function WorkflowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, data, selected }: EdgeProps<WorkflowEdgeData>) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const kind = data?.kind ?? 'execution';
  const tone = EDGE_STYLE[kind];
  const dashed = kind === 'conditional' || kind === 'event' || kind === 'data';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: tone.stroke,
          strokeWidth: selected ? 3.2 : 2.2,
          strokeDasharray: dashed ? '8 6' : undefined,
          opacity: selected ? 1 : 0.88,
        }}
      />
      {data?.label || selected ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-full border border-white/8 bg-[rgba(18,25,35,0.95)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data?.label ?? tone.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
