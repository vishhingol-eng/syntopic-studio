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
  | 'start'
  | 'end'
  | 'event'
  | 'trigger'
  | 'scheduler'
  | 'delay'
  | 'wait'
  | 'stop'
  | 'condition'
  | 'switch'
  | 'router'
  | 'merge'
  | 'parallel'
  | 'loop'
  | 'retry'
  | 'errorHandler'
  | 'agent'
  | 'supervisor'
  | 'planner'
  | 'reasoner'
  | 'reflection'
  | 'llm'
  | 'prompt'
  | 'embedding'
  | 'evaluator'
  | 'sessionMemory'
  | 'persistentMemory'
  | 'semanticMemory'
  | 'episodicMemory'
  | 'workingMemory'
  | 'memorySearch'
  | 'memoryWrite'
  | 'knowledgeSearch'
  | 'vectorSearch'
  | 'rag'
  | 'documentSearch'
  | 'knowledgeGraph'
  | 'retriever'
  | 'http'
  | 'restApi'
  | 'mcpTool'
  | 'browser'
  | 'python'
  | 'javascript'
  | 'sql'
  | 'shell'
  | 'calculator'
  | 'json'
  | 'csv'
  | 'xml'
  | 'file'
  | 'database'
  | 'variable'
  | 'transformer'
  | 'parser'
  | 'approval'
  | 'feedback'
  | 'chat'
  | 'form'
  | 'review'
  | 'email'
  | 'slack'
  | 'discord'
  | 'teams'
  | 'sms'
  | 'webhook'
  | 'response'
  | 'report'
  | 'dashboard'
  | 'export'
  | 'download';

export type NodeShape = 'rounded' | 'pill' | 'diamond' | 'group';
export type NodeStatus = 'idle' | 'running' | 'waiting' | 'paused' | 'completed' | 'failed' | 'selected';
export type EdgeKind = 'execution' | 'data' | 'memory' | 'knowledge' | 'conditional' | 'event';
export type ConsoleTab = 'console' | 'timeline' | 'logs' | 'events' | 'errors' | 'performance' | 'cost' | 'tokens' | 'debug';
export type InspectorTab = 'general' | 'properties' | 'prompt' | 'memory' | 'knowledge' | 'advanced' | 'debug';
export type ExplorerTab = 'projects' | 'workflows' | 'agents' | 'prompts' | 'tools' | 'memory' | 'knowledge' | 'templates' | 'assets' | 'deployments';

export interface WorkflowPortDefinition {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  multiple?: boolean;
  defaultValue?: string;
  validation?: string;
  description?: string;
}

export interface WorkflowNodeConfig extends Record<string, unknown> {
  prompt?: string;
  memoryScope?: string;
  knowledgeScope?: string;
  runtimeBinding?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  retries?: number;
  notes?: string;
}

export interface WorkflowNodeRuntime {
  status: NodeStatus;
  step?: string;
  version?: string;
  cost?: number;
  tokens?: number;
  latencyMs?: number;
  lastRun?: string;
}

export interface WorkflowNodeData {
  nodeType: WorkflowNodeType;
  category: NodeCategory;
  title: string;
  description: string;
  icon: string;
  accent: string;
  shape: NodeShape;
  inputs: WorkflowPortDefinition[];
  outputs: WorkflowPortDefinition[];
  config: WorkflowNodeConfig;
  runtime: WorkflowNodeRuntime;
  breakpoint?: boolean;
  comments?: number;
}

export interface WorkflowEdgeData {
  kind: EdgeKind;
  label?: string;
  animated?: boolean;
  validated?: boolean;
}

export interface ConsoleEntry {
  id: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'debug';
  scope: string;
  message: string;
  time: string;
}
