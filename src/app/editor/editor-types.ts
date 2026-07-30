export type NodeKind =
  | 'source'
  | 'transform'
  | 'filter'
  | 'aggregate'
  | 'output'
  | 'annotation';

export type EdgeKind =
  | 'data'
  | 'control'
  | 'reference'
  | 'execution'
  | 'memory'
  | 'knowledge'
  | 'conditional'
  | 'event';

export type NodeCategory =
  | 'Flow'
  | 'Logic'
  | 'AI'
  | 'Memory'
  | 'Knowledge'
  | 'Tools'
  | 'Data'
  | 'Human'
  | 'Communication'
  | 'Output';

export type WorkflowNodeType =
  | 'start' | 'end' | 'event' | 'trigger' | 'scheduler' | 'delay' | 'wait' | 'stop'
  | 'condition' | 'switch' | 'router' | 'merge' | 'parallel' | 'loop' | 'retry' | 'errorHandler'
  | 'agent' | 'supervisor' | 'planner' | 'reasoner' | 'reflection' | 'llm' | 'prompt' | 'embedding' | 'evaluator'
  | 'sessionMemory' | 'persistentMemory' | 'semanticMemory' | 'episodicMemory' | 'workingMemory' | 'memorySearch' | 'memoryWrite'
  | 'knowledgeSearch' | 'vectorSearch' | 'rag' | 'documentSearch' | 'knowledgeGraph' | 'retriever'
  | 'http' | 'restApi' | 'mcpTool' | 'browser' | 'python' | 'javascript' | 'sql' | 'shell' | 'calculator'
  | 'json' | 'csv' | 'xml' | 'file' | 'database' | 'variable' | 'transformer' | 'parser'
  | 'approval' | 'feedback' | 'chat' | 'form' | 'review'
  | 'email' | 'slack' | 'discord' | 'teams' | 'sms' | 'webhook'
  | 'response' | 'report' | 'dashboard' | 'export' | 'download';

export interface WorkflowPortDefinition {
  id: string;
  label: string;
  type: string;
}

export type RuntimeStatus = 'idle' | 'running' | 'waiting' | 'paused' | 'completed' | 'failed' | 'selected';

export interface WorkflowNodeRuntime {
  status: RuntimeStatus;
  step?: string;
  tokens?: number;
  cost?: number;
  latencyMs?: number;
  version?: string;
  [key: string]: unknown;
}

export interface WorkflowNodeData extends Record<string, unknown> {
  nodeType: WorkflowNodeType;
  category: NodeCategory;
  title: string;
  description: string;
  icon: string;
  accent: string;
  shape: 'rounded' | 'pill' | 'diamond' | 'group' | 'unknown';
  inputs: WorkflowPortDefinition[];
  outputs: WorkflowPortDefinition[];
  config: Record<string, unknown>;
  runtime: WorkflowNodeRuntime;
  breakpoint?: boolean;
  kind?: NodeKind;
  label?: string;
}

export interface WorkflowEdgeData extends Record<string, unknown> {
  kind: EdgeKind;
  label?: string;
  animated?: boolean;
  validated?: boolean;
}

export type ConsoleTab =
  | 'console' | 'timeline' | 'logs' | 'events' | 'errors'
  | 'performance' | 'cost' | 'tokens' | 'debug';

export type ExplorerTab =
  | 'projects' | 'workflows' | 'agents' | 'prompts' | 'tools'
  | 'memory' | 'knowledge' | 'templates' | 'assets' | 'deployments';

export type InspectorTab =
  | 'general' | 'properties' | 'prompt' | 'memory' | 'knowledge' | 'advanced' | 'debug';

export type RuntimeStatusLabel = 'idle' | 'running' | 'paused' | 'stepping' | 'completed' | 'failed' | 'deploying';

export interface ConsoleEntry {
  id: string;
  time: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'debug';
  scope: string;
  message: string;
}
