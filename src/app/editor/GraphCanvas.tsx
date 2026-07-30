import { useCallback } from 'react';
// FIX: ReactFlow<N,E> in @xyflow/react v12 expects N extends Node and E extends Edge
// (full node/edge types, not bare data types).
// Define WFNode = Node<WorkflowNodeData> and WFEdge = Edge<WorkflowEdgeData>,
// then use ReactFlow<WFNode, WFEdge>.
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useEditorStore } from './editor-store';
import { WorkflowNodeData, WorkflowEdgeData } from './editor-types';
import { WorkflowNodeComponent } from './nodes';
import { WorkflowEdgeComponent } from './edges';

// FIX: Full node/edge type aliases — required by ReactFlow<N,E> in v12
type WFNode = Node<WorkflowNodeData>;
type WFEdge = Edge<WorkflowEdgeData>;

const nodeTypes: NodeTypes = {
  source:     WorkflowNodeComponent,
  transform:  WorkflowNodeComponent,
  filter:     WorkflowNodeComponent,
  aggregate:  WorkflowNodeComponent,
  output:     WorkflowNodeComponent,
  annotation: WorkflowNodeComponent,
};

const edgeTypes: EdgeTypes = {
  data:      WorkflowEdgeComponent,
  control:   WorkflowEdgeComponent,
  reference: WorkflowEdgeComponent,
};

export function GraphCanvas() {
  const nodes         = useEditorStore((s) => s.nodes);
  const edges         = useEditorStore((s) => s.edges);
  const onNodesChange = useEditorStore((s) => s.onNodesChange);
  const onEdgesChange = useEditorStore((s) => s.onEdgesChange);
  const onConnect     = useEditorStore((s) => s.onConnect);
  const selectNode    = useEditorStore((s) => s.selectNode);

  const handlePaneClick = useCallback(() => selectNode(null), [selectNode]);

  return (
    // FIX: was ReactFlow<WorkflowNodeData, WorkflowEdgeData> — now ReactFlow<WFNode, WFEdge>
    <ReactFlow<WFNode, WFEdge>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={handlePaneClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      attributionPosition="bottom-right"
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#3f3f46" />
      <Controls className="!bg-zinc-800 !border-zinc-700" />
      <MiniMap
        className="!bg-zinc-900 !border-zinc-700"
        nodeColor="#52525b"
        maskColor="rgba(0,0,0,0.6)"
      />
    </ReactFlow>
  );
}
