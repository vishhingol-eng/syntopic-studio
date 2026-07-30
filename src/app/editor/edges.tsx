import { memo } from 'react';
// FIX: In @xyflow/react v12, EdgeProps<T> expects T to be a full Edge<Data> type,
// NOT just the Data type. Define WorkflowEdgeType = Edge<WorkflowEdgeData>
// and use EdgeProps<WorkflowEdgeType>.
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';
import { WorkflowEdgeData, EdgeKind } from './editor-types';

// FIX: Full edge type alias — required by EdgeProps<T> in v12
type WorkflowEdgeType = Edge<WorkflowEdgeData>;

const KIND_STROKE: Record<EdgeKind, string> = {
  data:        '#60a5fa',  // blue-400
  control:     '#f59e0b',  // amber-400
  reference:   '#a78bfa',  // violet-400
  execution:   '#94a3b8',  // slate-400
  memory:      '#34d399',  // emerald-400
  knowledge:   '#38bdf8',  // sky-400
  conditional: '#f472b6',  // pink-400
  event:       '#fb923c',  // orange-400
};

// FIX: was EdgeProps<WorkflowEdgeData> — now EdgeProps<WorkflowEdgeType>
function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<WorkflowEdgeType>) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const stroke = KIND_STROKE[data?.kind ?? 'data'] ?? '#60a5fa';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke, strokeWidth: 1.5 }}
        markerEnd="url(#arrow)"
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="text-[10px] text-zinc-300 bg-zinc-900 px-1 rounded"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const WorkflowEdgeComponent = memo(WorkflowEdge);
