import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type Node,
  type Edge,
} from '@xyflow/react';
import { WorkflowNodeData, WorkflowEdgeData } from './editor-types';
// FIX: inferEdgeKind was called on line ~188 but was never imported.
// It lives in graph-utils.ts — adding it here resolves the TS error.
import { validateConnectionTypes, inferEdgeKind } from './graph-utils';
import { NODE_PRESETS } from './node-presets';

type WFNode = Node<WorkflowNodeData>;
type WFEdge = Edge<WorkflowEdgeData>;

interface EditorState {
  nodes: WFNode[];
  edges: WFEdge[];
  selectedNodeId: string | null;
  consoleMessages: string[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (kind: WorkflowNodeData['kind']) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (id: string, config: Record<string, unknown>) => void;
  logMessage: (msg: string) => void;
  clearConsole: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  consoleMessages: [],

  onNodesChange: (changes) => {
    set((state) => ({
      // FIX: NodePositionChange.position is XYPosition | undefined in v12.
      // applyNodeChanges handles the undefined case internally — no spread needed.
      nodes: applyNodeChanges(changes, state.nodes) as WFNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as WFEdge[],
    }));
  },

  onConnect: (connection) => {
    const { nodes } = get();
    if (!validateConnectionTypes(connection, nodes)) {
      get().logMessage(`⚠️ Connection rejected: incompatible node types`);
      return;
    }
    // FIX: inferEdgeKind is now properly imported from graph-utils
    const kind = inferEdgeKind(connection, nodes);
    const newEdge: WFEdge = {
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      data: { kind },
      type: kind,
    };
    set((state) => ({
      edges: addEdge(newEdge, state.edges) as WFEdge[],
    }));
    get().logMessage(`✓ Connected ${connection.source} → ${connection.target} (${kind})`);
  },

  addNode: (kind) => {
    const preset = NODE_PRESETS[kind];
    const id = `${kind}-${Date.now()}`;
    const newNode: WFNode = {
      id,
      type: kind,
      position: { x: 200 + Math.random() * 200, y: 150 + Math.random() * 200 },
      data: {
        kind,
        label: preset.label,
        description: preset.description,
        config: { ...preset.defaultConfig },
      },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
    get().logMessage(`+ Added ${preset.label} node`);
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeConfig: (id, config) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, config } } : n
      ),
    }));
  },

  logMessage: (msg) => {
    const ts = new Date().toLocaleTimeString();
    set((state) => ({
      consoleMessages: [...state.consoleMessages, `[${ts}] ${msg}`],
    }));
  },

  clearConsole: () => set({ consoleMessages: [] }),
}));
