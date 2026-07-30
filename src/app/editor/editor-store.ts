import { create } from 'zustand';
import type { Connection, Edge, Node, NodeChange, EdgeChange } from '@xyflow/react';
import {
  INITIAL_GRAPH_EDGES,
  INITIAL_GRAPH_NODES,
  NODE_PRESET_MAP,
  buildNodeData,
  type NodePreset,
} from './node-presets';
import type {
  ConsoleEntry,
  ConsoleTab,
  ExplorerTab,
  InspectorTab,
  NodeCategory,
  NodeStatus,
  WorkflowEdgeData,
  WorkflowNodeData,
  WorkflowNodeType,
} from './editor-types';
import { validateConnectionTypes } from './graph-utils';

interface GraphSnapshot {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge<WorkflowEdgeData>[];
}

interface EditorState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge<WorkflowEdgeData>[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  activeExplorerTab: ExplorerTab;
  activeInspectorTab: InspectorTab;
  activeConsoleTab: ConsoleTab;
  runtimeStatus: 'idle' | 'running' | 'paused' | 'debugging' | 'completed' | 'error';
  consoleEntries: ConsoleEntry[];
  history: GraphSnapshot[];
  future: GraphSnapshot[];
  lastAction: string;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge<WorkflowEdgeData>[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  connectEdge: (connection: Connection) => void;
  updateNodeData: (nodeId: string, patch: Partial<WorkflowNodeData>) => void;
  updateSelectedNodeData: (patch: Partial<WorkflowNodeData>) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  setActiveExplorerTab: (tab: ExplorerTab) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setActiveConsoleTab: (tab: ConsoleTab) => void;
  setRuntimeStatus: (status: EditorState['runtimeStatus']) => void;
  pushConsole: (entry: Omit<ConsoleEntry, 'id' | 'time'>) => void;
  deleteSelection: () => void;
  toggleBreakpoint: (nodeId: string) => void;
  runWorkflow: () => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  stepWorkflow: () => void;
  deployWorkflow: () => void;
  undo: () => void;
  redo: () => void;
  restoreSnapshot: (snapshot: GraphSnapshot) => void;
}

const cloneSnapshot = (nodes: Node<WorkflowNodeData>[], edges: Edge<WorkflowEdgeData>[]): GraphSnapshot => ({
  nodes: structuredClone(nodes),
  edges: structuredClone(edges),
});

const createLog = (level: ConsoleEntry['level'], scope: string, message: string): ConsoleEntry => ({
  id: crypto.randomUUID(),
  level,
  scope,
  message,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
});

const initialLogs = [
  createLog('info', 'runtime', 'PCOS runtime ready'),
  createLog('success', 'graph', 'Initial workflow loaded'),
  createLog('debug', 'memory', 'Context bundle hydrated from PCOS memory'),
];

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: INITIAL_GRAPH_NODES,
  edges: INITIAL_GRAPH_EDGES as Edge<WorkflowEdgeData>[],
  selectedNodeId: null,
  selectedEdgeId: null,
  activeExplorerTab: 'workflows',
  activeInspectorTab: 'general',
  activeConsoleTab: 'console',
  runtimeStatus: 'idle',
  consoleEntries: initialLogs,
  history: [],
  future: [],
  lastAction: 'Workflow loaded',
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) =>
    set((state) => {
      const nodes = state.nodes.map((node) => ({ ...node }));
      const next = changes.reduce<Node<WorkflowNodeData>[]>((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter((node) => node.id !== change.id);
        }
        if (change.type === 'select') {
          return acc.map((node) => (node.id === change.id ? { ...node, selected: change.selected } : node));
        }
        if (change.type === 'position' && change.position) {
          return acc.map((node) => (node.id === change.id ? { ...node, position: change.position, dragging: change.dragging } : node));
        }
        if (change.type === 'dimensions' && change.dimensions) {
          return acc.map((node) => (node.id === change.id ? { ...node, width: change.dimensions.width, height: change.dimensions.height } : node));
        }
        return acc;
      }, nodes);
      return { nodes: next };
    }),
  onEdgesChange: (changes) =>
    set((state) => {
      const edges = state.edges.map((edge) => ({ ...edge }));
      const next = changes.reduce<Edge<WorkflowEdgeData>[]>((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter((edge) => edge.id !== change.id);
        }
        if (change.type === 'select') {
          return acc.map((edge) => (edge.id === change.id ? { ...edge, selected: change.selected } : edge));
        }
        return acc;
      }, edges);
      return { edges: next };
    }),
  addNode: (type, position) => {
    const preset: NodePreset | undefined = NODE_PRESET_MAP.get(type);
    if (!preset) return;

    const node: Node<WorkflowNodeData> = {
      id: crypto.randomUUID(),
      type: 'workflowNode',
      position,
      data: {
        nodeType: preset.type,
        category: preset.category,
        title: preset.title,
        description: preset.description,
        icon: preset.icon,
        accent: preset.accent,
        shape: preset.shape,
        inputs: preset.inputs,
        outputs: preset.outputs,
        config: {},
        runtime: { status: 'idle' },
        ...preset.defaults,
      },
    };

    set((state) => ({
      history: [...state.history, cloneSnapshot(state.nodes, state.edges)],
      future: [],
      nodes: [...state.nodes, node],
      selectedNodeId: node.id,
      selectedEdgeId: null,
      activeInspectorTab: 'general',
      lastAction: `Added ${preset.title}`,
      consoleEntries: [...state.consoleEntries, createLog('info', 'canvas', `Added ${preset.title} node`)],
    }));
  },
  connectEdge: (connection) => {
    const state = get();
    if (!validateConnectionTypes(connection, state.nodes)) return;

    set((next) => ({
      history: [...next.history, cloneSnapshot(next.nodes, next.edges)],
      future: [],
      edges: [
        ...next.edges,
        {
          id: crypto.randomUUID(),
          source: connection.source ?? '',
          target: connection.target ?? '',
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          type: 'workflowEdge',
          animated: true,
          data: { kind: inferEdgeKind(connection, next.nodes), animated: true, validated: true },
        } satisfies Edge<WorkflowEdgeData>,
      ],
      lastAction: 'Connected nodes',
      consoleEntries: [...next.consoleEntries, createLog('success', 'graph', 'Execution edge created')],
    }));
  },
  updateNodeData: (nodeId, patch) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node)),
      lastAction: `Updated node ${nodeId}`,
    })),
  updateSelectedNodeData: (patch) => {
    const { selectedNodeId } = get();
    if (!selectedNodeId) return;
    get().updateNodeData(selectedNodeId, patch);
  },
  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),
  setActiveExplorerTab: (tab) => set({ activeExplorerTab: tab }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setActiveConsoleTab: (tab) => set({ activeConsoleTab: tab }),
  setRuntimeStatus: (runtimeStatus) => set({ runtimeStatus }),
  pushConsole: (entry) =>
    set((state) => ({
      consoleEntries: [...state.consoleEntries, { ...entry, id: crypto.randomUUID(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }],
    })),
  deleteSelection: () => {
    const state = get();
    const nodeIds = new Set(state.nodes.filter((node) => node.selected).map((node) => node.id));
    const edgeIds = new Set(state.edges.filter((edge) => edge.selected).map((edge) => edge.id));

    if (!nodeIds.size && !edgeIds.size) return;

    set((current) => ({
      history: [...current.history, cloneSnapshot(current.nodes, current.edges)],
      future: [],
      nodes: current.nodes.filter((node) => !nodeIds.has(node.id)),
      edges: current.edges.filter((edge) => !edgeIds.has(edge.id) && !nodeIds.has(edge.source) && !nodeIds.has(edge.target)),
      selectedNodeId: null,
      selectedEdgeId: null,
      lastAction: 'Deleted selection',
      consoleEntries: [...current.consoleEntries, createLog('warn', 'graph', 'Selection deleted')],
    }));
  },
  toggleBreakpoint: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, breakpoint: !node.data.breakpoint } } : node)),
      lastAction: 'Toggled breakpoint',
    })),
  runWorkflow: () =>
    set((state) => ({
      runtimeStatus: 'running',
      activeConsoleTab: 'timeline',
      consoleEntries: [...state.consoleEntries, createLog('info', 'runtime', 'Workflow execution started')],
      nodes: state.nodes.map((node) => (node.id === state.selectedNodeId ? { ...node, data: { ...node.data, runtime: { ...node.data.runtime, status: 'running' } } } : node)),
      lastAction: 'Run workflow',
    })),
  pauseWorkflow: () =>
    set((state) => ({
      runtimeStatus: 'paused',
      consoleEntries: [...state.consoleEntries, createLog('warn', 'runtime', 'Workflow paused')],
      lastAction: 'Paused workflow',
    })),
  resumeWorkflow: () =>
    set((state) => ({
      runtimeStatus: 'running',
      consoleEntries: [...state.consoleEntries, createLog('success', 'runtime', 'Workflow resumed')],
      lastAction: 'Resumed workflow',
    })),
  stepWorkflow: () =>
    set((state) => ({
      runtimeStatus: 'debugging',
      consoleEntries: [...state.consoleEntries, createLog('debug', 'runtime', 'Advanced one execution step')],
      lastAction: 'Stepped workflow',
    })),
  deployWorkflow: () =>
    set((state) => ({
      runtimeStatus: 'completed',
      consoleEntries: [...state.consoleEntries, createLog('success', 'deploy', 'Workflow deployed successfully')],
      lastAction: 'Deployed workflow',
    })),
  undo: () => {
    const state = get();
    const previous = state.history.at(-1);
    if (!previous) return;
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: state.history.slice(0, -1),
      future: [cloneSnapshot(state.nodes, state.edges), ...state.future],
      lastAction: 'Undo',
    });
  },
  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) return;
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: state.future.slice(1),
      history: [...state.history, cloneSnapshot(state.nodes, state.edges)],
      lastAction: 'Redo',
    });
  },
  restoreSnapshot: (snapshot) =>
    set({
      nodes: snapshot.nodes,
      edges: snapshot.edges,
      lastAction: 'Snapshot restored',
    }),
}));
