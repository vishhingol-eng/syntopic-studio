import { memo } from 'react';
// FIX: In @xyflow/react v12, NodeProps<T> expects T to be a full Node<Data> type,
// NOT just the Data type. Define WorkflowNodeType = Node<WorkflowNodeData>
// and use NodeProps<WorkflowNodeType>.
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { WorkflowNodeData, NodeKind } from './editor-types';
import { useEditorStore } from './editor-store';

// FIX: Full node type alias — required by NodeProps<T> in v12
type WorkflowNodeType = Node<WorkflowNodeData>;

const KIND_COLORS: Record<NodeKind, string> = {
  source:     'bg-blue-900 border-blue-500',
  transform:  'bg-purple-900 border-purple-500',
  filter:     'bg-yellow-900 border-yellow-500',
  aggregate:  'bg-green-900 border-green-500',
  output:     'bg-red-900 border-red-500',
  annotation: 'bg-zinc-800 border-zinc-500',
};

const KIND_ICONS: Record<NodeKind, string> = {
  source:     '⬤',
  transform:  '⟳',
  filter:     '▽',
  aggregate:  '∑',
  output:     '▶',
  annotation: '✎',
};

// FIX: was NodeProps<WorkflowNodeData> — now NodeProps<WorkflowNodeType>
function WorkflowNode({ id, data }: NodeProps<WorkflowNodeType>) {
  const selectNode   = useEditorStore((s) => s.selectNode);
  const selectedId   = useEditorStore((s) => s.selectedNodeId);
  const isSelected   = selectedId === id;
  const colorClass   = KIND_COLORS[data.kind] ?? 'bg-zinc-800 border-zinc-500';
  const icon         = KIND_ICONS[data.kind]  ?? '?';

  return (
    <div
      className={`min-w-[140px] rounded-lg border-2 ${colorClass} ${
        isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''
      } cursor-pointer select-none`}
      onClick={() => selectNode(id)}
    >
      {data.kind !== 'source' && (
        <Handle type="target" position={Position.Left} className="!bg-zinc-400" />
      )}

      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">{icon}</span>
          <span className="text-xs font-semibold text-white truncate">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{data.description}</p>
        )}
      </div>

      {data.kind !== 'output' && (
        <Handle type="source" position={Position.Right} className="!bg-zinc-400" />
      )}
    </div>
  );
}

export const WorkflowNodeComponent = memo(WorkflowNode);
