export type NodeKind =
  | 'source'
  | 'transform'
  | 'filter'
  | 'aggregate'
  | 'output'
  | 'annotation';

export type EdgeKind = 'data' | 'control' | 'reference';

// FIX: extends Record<string, unknown> added to both interfaces.
// @xyflow/react v12 requires this index signature on all custom node/edge
// data types. Without it tsc --noEmit throws 30+ errors and vite build never runs.

export interface WorkflowNodeData extends Record<string, unknown> {
  kind: NodeKind;
  label: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface WorkflowEdgeData extends Record<string, unknown> {
  kind: EdgeKind;
  label?: string;
}
