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
import type {
  WorkflowNodeData,
  WorkflowEdgeData,
  ConsoleTab,
  ExplorerTab,
  InspectorTab,
  ConsoleEntry,
  RuntimeStatusLabel,
} from './editor-types';
import { validateConnectionTypes, inferEdgeKind } from './graph-utils';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES } from './node-presets';

type WFNode = Node<WorkflowNodeData>;
type WFEdge = Edge<WorkflowEdgeData>;

interface EditorState {
  nodes: WFNode[];
  edges: WFEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  history: Array<{ nodes: WFNode[]; edges: WFEdge[] }>;
  historyIndex: number;
  runtimeStatus: RuntimeStatusLabel;
  lastAction: string;
  consoleEntries: ConsoleEntry[];
  activeConsoleTab: ConsoleTab;
  activeExplorerTab: ExplorerTab;
  activeInspectorTab: InspectorTab;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: WorkflowNodeData['nodeType'], position?: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  deleteSelection: () => void;
  updateSelectedNodeData: (patch: Partial<WorkflowNodeData>) => void;
  updateNodeConfig: (id: string, config: Record<string, unknown>) => void;
  toggleBreakpoint: (id: string) => void;
  undo: () => void;
  redo: () => void;
  runWorkflow: () => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  stepWorkflow: () => void;
  deployWorkflow: () => void;
  setActiveConsoleTab: (tab: ConsoleTab) => void;
  setActiveExplorerTab: (tab: ExplorerTab) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  logMessage: (msg: string) => void;
  clearConsole: () => void;
  consoleMessages: string[];
}

let _counter = 0;
function makeEntry(level: ConsoleEntry['level'], scope: string, message: string): ConsoleEntry {
  return { id: `e-${++_counter}`, time: new Date().toLocaleTimeString(), level, scope, message };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: INITIAL_GRAPH_NODES as WFNode[],
  edges: INITIAL_GRAPH_EDGES as WFEdge[],
  selectedNodeId: null,
  selectedEdgeId: null,
  history: [],
  historyIndex: -1,
  runtimeStatus: 'idle',
  lastAction: 'Ready',
  consoleMessages: [],
  consoleEntries: [
    makeEntry('info', 'system', 'Syntopic Studio initialised'),
    makeEntry('success', 'graph', 'Workflow graph loaded — 9 nodes, 9 edges'),
    makeEntry('debug', 'pcos', 'PCOS runtime binding active'),
  ],
  activeConsoleTab: 'console',
  activeExplorerTab: 'projects',
  activeInspectorTab: 'general',

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as WFNode[] })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as WFEdge[] })),

  onConnect: (connection) => {
    const { nodes } = get();
    if (!validateConnectionTypes(connection, nodes)) {
      get().logMessage('⚠️ Connection rejected: incompatible node types');
      return;
    }
    const kind = inferEdgeKind(connection, nodes);
    const newEdge: WFEdge = {
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      data: { kind, validated: true },
      type: 'workflowEdge',
    };
    set((s) => ({
      edges: addEdge(newEdge, s.edges) as WFEdge[],
      lastAction: `Connected ${connection.source} → ${connection.target}`,
      consoleEntries: [...s.consoleEntries, makeEntry('success', 'graph', `Connected (${kind})`)],
    }));
  },

  addNode: (type, position) => {
    import('./node-presets').then(({ buildNodeData }) => {
      const data = buildNodeData(type);
      const id = `${type}-${Date.now()}`;
      const newNode: WFNode = {
        id,
        type: 'workflowNode',
        position: position ?? { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
        data,
      };
      set((s) => ({
        nodes: [...s.nodes, newNode],
        lastAction: `Added ${data.title}`,
        consoleEntries: [...s.consoleEntries, makeEntry('info', 'graph', `+ Added ${data.title}`)],
      }));
    });
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  deleteSelection: () => {
    const { selectedNodeId, selectedEdgeId } = get();
    if (selectedNodeId) {
      set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== selectedNodeId),
        edges: s.edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
        selectedNodeId: null,
        lastAction: `Deleted ${selectedNodeId}`,
      }));
    } else if (selectedEdgeId) {
      set((s) => ({
        edges: s.edges.filter((e) => e.id !== selectedEdgeId),
        selectedEdgeId: null,
        lastAction: 'Deleted edge',
      }));
    }
  },

  updateSelectedNodeData: (patch) => {
    const { selectedNodeId } = get();
    if (!selectedNodeId) return;
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n
      ),
    }));
  },

  updateNodeConfig: (id, config) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, config } } : n)),
    })),

  toggleBreakpoint: (id) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, breakpoint: !n.data.breakpoint } } : n
      ),
      lastAction: `Toggled breakpoint on ${id}`,
    })),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1, lastAction: 'Undo' });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1, lastAction: 'Redo' });
  },

  runWorkflow: () =>
    set((s) => ({
      runtimeStatus: 'running',
      lastAction: 'Run ⌘⏎',
      consoleEntries: [...s.consoleEntries, makeEntry('info', 'runtime', '▶ Workflow started')],
    })),

  pauseWorkflow: () =>
    set((s) => ({
      runtimeStatus: 'paused',
      lastAction: 'Pause',
      consoleEntries: [...s.consoleEntries, makeEntry('warn', 'runtime', '⏸ Paused')],
    })),

  resumeWorkflow: () =>
    set((s) => ({
      runtimeStatus: 'running',
      lastAction: 'Resume',
      consoleEntries: [...s.consoleEntries, makeEntry('info', 'runtime', '▶ Resumed')],
    })),

  stepWorkflow: () =>
    set((s) => ({
      runtimeStatus: 'stepping',
      lastAction: 'Step F6',
      consoleEntries: [...s.consoleEntries, makeEntry('debug', 'runtime', '→ Step')],
    })),

  deployWorkflow: () => {
    set((s) => ({
      runtimeStatus: 'deploying',
      lastAction: 'Deploy',
      consoleEntries: [...s.consoleEntries, makeEntry('info', 'deploy', '🚀 Deploying…')],
    }));
    setTimeout(
      () =>
        set((s) => ({
          runtimeStatus: 'idle',
          lastAction: 'Deployed ✓',
          consoleEntries: [...s.consoleEntries, makeEntry('success', 'deploy', '✓ Done')],
        })),
      2000
    );
  },

  setActiveConsoleTab: (tab) => set({ activeConsoleTab: tab }),
  setActiveExplorerTab: (tab) => set({ activeExplorerTab: tab }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),

  logMessage: (msg) =>
    set((s) => ({
      consoleEntries: [...s.consoleEntries, makeEntry('info', 'app', msg)],
      consoleMessages: [...s.consoleMessages, `[${new Date().toLocaleTimeString()}] ${msg}`],
    })),

  clearConsole: () => set({ consoleEntries: [], consoleMessages: [] }),
}));
