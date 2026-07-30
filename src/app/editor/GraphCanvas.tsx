import { useCallback, useEffect, useMemo, type DragEvent } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import { useEditorStore } from './editor-store';
import { NODE_PRESET_MAP } from './node-presets';
import type { WorkflowEdgeData, WorkflowNodeData, WorkflowNodeType } from './editor-types';
import { WorkflowNode } from './nodes';
import { WorkflowEdge } from './edges';

const nodeTypes = { workflowNode: WorkflowNode };
const edgeTypes = { workflowEdge: WorkflowEdge };

function CanvasInner() {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const nodes = useEditorStore((state) => state.nodes);
  const edges = useEditorStore((state) => state.edges);
  const onNodesChange = useEditorStore((state) => state.onNodesChange);
  const onEdgesChange = useEditorStore((state) => state.onEdgesChange);
  const connectEdge = useEditorStore((state) => state.connectEdge);
  const selectNode = useEditorStore((state) => state.selectNode);
  const selectEdge = useEditorStore((state) => state.selectEdge);
  const addNode = useEditorStore((state) => state.addNode);
  const pushConsole = useEditorStore((state) => state.pushConsole);

  useEffect(() => {
    fitView({ padding: 0.16, duration: 300 });
  }, [fitView]);

  const onConnect = useCallback((connection: Connection) => {
    connectEdge(connection);
  }, [connectEdge]);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/x-syntopic-node') as WorkflowNodeType | '';
    if (!type) return;

    const preset = NODE_PRESET_MAP.get(type);
    if (!preset) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addNode(type, position);
    pushConsole({ level: 'info', scope: 'canvas', message: `Dropped ${preset.title} from library` });
  }, [addNode, pushConsole, screenToFlowPosition]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const selectedCounts = useMemo(() => ({
    nodes: nodes.filter((node) => node.selected).length,
    edges: edges.filter((edge) => edge.selected).length,
  }), [nodes, edges]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1017]">
      <ReactFlow<WorkflowNodeData, WorkflowEdgeData>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => selectNode(node.id)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
        }}
        onSelectionChange={({ nodes: selectedNodes, edges: selectedEdges }) => {
          if (selectedNodes.length > 0) {
            selectNode(selectedNodes[0].id);
            selectEdge(null);
            return;
          }

          if (selectedEdges.length > 0) {
            selectNode(null);
            selectEdge(selectedEdges[0].id);
            return;
          }

          selectNode(null);
          selectEdge(null);
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        minZoom={0.15}
        maxZoom={1.75}
        snapToGrid
        snapGrid={[16, 16]}
        selectionOnDrag
        nodesDraggable
        nodesConnectable
        elementsSelectable
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Backspace"
        className="h-full w-full"
        defaultEdgeOptions={{ type: 'workflowEdge', animated: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="rgba(255,255,255,0.08)" />
        <MiniMap
          nodeColor={(node) => (node.data as WorkflowNodeData).accent}
          maskColor="rgba(2, 6, 12, 0.72)"
          pannable
          zoomable
          style={{ background: 'rgba(16, 22, 30, 0.96)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <Controls position="bottom-right" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/8 bg-[rgba(18,25,35,0.9)] px-4 py-3 shadow-panel backdrop-blur-md">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Canvas</div>
          <div className="mt-1 text-[13px] font-semibold text-slate-100">Infinite graph editor</div>
          <div className="mt-1 text-[11px] text-slate-400">{selectedCounts.nodes} nodes • {selectedCounts.edges} edges selected</div>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-white/8 bg-[rgba(18,25,35,0.9)] px-4 py-3 shadow-panel backdrop-blur-md">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Execution</div>
          <div className="mt-1 text-[13px] font-semibold text-slate-100">Live runtime visualization</div>
          <div className="mt-1 text-[11px] text-slate-400">Active, waiting, completed, failed states are highlighted in real time.</div>
        </div>
      </ReactFlow>
    </div>
  );
}

export default function GraphCanvas() {
  return (
    <div className="min-h-0 min-w-0 border-x border-white/5 bg-[#0b1017]">
      <CanvasInner />
    </div>
  );
}
