import type { Node } from '@xyflow/react';
import type { NodeCategory, WorkflowNodeData, WorkflowNodeType, WorkflowPortDefinition } from './editor-types';

export interface NodePreset {
  type: WorkflowNodeType;
  category: NodeCategory;
  title: string;
  description: string;
  icon: string;
  accent: string;
  shape: WorkflowNodeData['shape'];
  inputs: WorkflowPortDefinition[];
  outputs: WorkflowPortDefinition[];
  defaults: Partial<WorkflowNodeData>;
}

const execIn = (id = 'in', label = 'exec'): WorkflowPortDefinition => ({ id, label, type: 'exec' });
const execOut = (id = 'out', label = 'exec'): WorkflowPortDefinition => ({ id, label, type: 'exec' });
const dataIn = (id = 'data', label = 'data', type = 'data'): WorkflowPortDefinition => ({ id, label, type });
const dataOut = (id = 'data', label = 'data', type = 'data'): WorkflowPortDefinition => ({ id, label, type });

export const NODE_PRESETS: NodePreset[] = [
  { type: 'start', category: 'Flow', title: 'Start', description: 'Entry point for a workflow.', icon: '▶', accent: '#6C8CFF', shape: 'pill', inputs: [], outputs: [execOut()], defaults: { config: { runtimeBinding: 'workflow-start' } } },
  { type: 'end', category: 'Flow', title: 'End', description: 'Finish the workflow cleanly.', icon: '■', accent: '#7F8EA3', shape: 'pill', inputs: [execIn(), dataIn('result', 'result', 'json')], outputs: [], defaults: { config: { runtimeBinding: 'workflow-end' } } },
  { type: 'event', category: 'Flow', title: 'Event', description: 'Emit or capture an event.', icon: '✦', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('payload', 'payload')], outputs: [execOut(), dataOut('event', 'event', 'event')], defaults: { runtime: { status: 'idle' } } },
  { type: 'trigger', category: 'Flow', title: 'Trigger', description: 'Start from a signal.', icon: '◎', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('signal', 'signal'), dataIn('condition', 'condition', 'boolean')], outputs: [execOut()], defaults: {} },
  { type: 'scheduler', category: 'Flow', title: 'Scheduler', description: 'Run on a schedule.', icon: '◷', accent: '#B59CFF', shape: 'rounded', inputs: [dataIn('override', 'override', 'boolean')], outputs: [execOut(), dataOut('event', 'event', 'event')], defaults: {} },
  { type: 'delay', category: 'Flow', title: 'Delay', description: 'Wait for a duration.', icon: '⌛', accent: '#E0A44B', shape: 'rounded', inputs: [execIn(), dataIn('duration', 'duration', 'number')], outputs: [execOut()], defaults: {} },
  { type: 'wait', category: 'Flow', title: 'Wait', description: 'Pause until resumed.', icon: 'Ⅱ', accent: '#E0A44B', shape: 'pill', inputs: [execIn(), dataIn('signal', 'signal', 'signal')], outputs: [execOut()], defaults: {} },
  { type: 'stop', category: 'Flow', title: 'Stop', description: 'Abort the run.', icon: '⛔', accent: '#FF6B6B', shape: 'pill', inputs: [execIn(), dataIn('reason', 'reason', 'string')], outputs: [dataOut('error', 'error', 'error')], defaults: {} },
  { type: 'condition', category: 'Logic', title: 'Condition', description: 'Branch by boolean result.', icon: '◇', accent: '#D95FFF', shape: 'diamond', inputs: [execIn(), dataIn('value', 'value')], outputs: [execOut('true', 'true'), execOut('false', 'false')], defaults: {} },
  { type: 'switch', category: 'Logic', title: 'Switch', description: 'Multi-way branch.', icon: '↯', accent: '#B59CFF', shape: 'diamond', inputs: [execIn(), dataIn('value', 'value')], outputs: [execOut('case-a', 'case A'), execOut('case-b', 'case B'), execOut('default', 'default')], defaults: {} },
  { type: 'router', category: 'Logic', title: 'Router', description: 'Dynamic route selection.', icon: '↗', accent: '#A98BFF', shape: 'rounded', inputs: [execIn(), dataIn('context', 'context', 'context')], outputs: [execOut('route-a', 'route A'), execOut('route-b', 'route B'), execOut('route-c', 'route C')], defaults: {} },
  { type: 'merge', category: 'Logic', title: 'Merge', description: 'Combine branches.', icon: '⋎', accent: '#7F8EA3', shape: 'rounded', inputs: [execIn('a', 'branch A'), execIn('b', 'branch B')], outputs: [execOut()], defaults: {} },
  { type: 'parallel', category: 'Logic', title: 'Parallel', description: 'Fan out execution.', icon: '⋈', accent: '#37C98A', shape: 'rounded', inputs: [execIn()], outputs: [execOut('a', 'branch A'), execOut('b', 'branch B'), execOut('c', 'branch C')], defaults: {} },
  { type: 'loop', category: 'Logic', title: 'Loop', description: 'Repeat until complete.', icon: '↻', accent: '#6C8CFF', shape: 'rounded', inputs: [execIn(), dataIn('condition', 'condition', 'boolean')], outputs: [execOut('iter', 'iteration'), execOut('done', 'done')], defaults: {} },
  { type: 'retry', category: 'Logic', title: 'Retry', description: 'Retry failures with backoff.', icon: '↺', accent: '#E0A44B', shape: 'rounded', inputs: [execIn(), dataIn('error', 'error', 'error')], outputs: [execOut('retry', 'retry'), execOut('fail', 'fail')], defaults: {} },
  { type: 'errorHandler', category: 'Logic', title: 'Error Handler', description: 'Recover or escalate errors.', icon: '⚠', accent: '#FF6B6B', shape: 'rounded', inputs: [dataIn('error', 'error', 'error')], outputs: [execOut('recover', 'recover'), execOut('fail', 'fail')], defaults: {} },
  { type: 'agent', category: 'AI', title: 'Agent', description: 'Autonomous task execution.', icon: '◌', accent: '#37C98A', shape: 'rounded', inputs: [execIn(), dataIn('context', 'context', 'context'), dataIn('prompt', 'prompt', 'prompt')], outputs: [execOut(), dataOut('result', 'result', 'json'), dataOut('memory', 'memory', 'memory')], defaults: { config: { model: 'pcos-agent', temperature: 0.2 } } },
  { type: 'supervisor', category: 'AI', title: 'Supervisor', description: 'Coordinate multiple agents.', icon: '⌘', accent: '#6C8CFF', shape: 'rounded', inputs: [execIn(), dataIn('context', 'context', 'context')], outputs: [execOut(), dataOut('plan', 'plan', 'json'), dataOut('result', 'result', 'json')], defaults: { config: { runtimeBinding: 'supervisor' } } },
  { type: 'planner', category: 'AI', title: 'Planner', description: 'Generate structured plans.', icon: '☰', accent: '#A98BFF', shape: 'rounded', inputs: [execIn(), dataIn('goal', 'goal', 'string')], outputs: [dataOut('plan', 'plan', 'json'), execOut()], defaults: {} },
  { type: 'reasoner', category: 'AI', title: 'Reasoner', description: 'Analyze and infer.', icon: '◑', accent: '#37C98A', shape: 'rounded', inputs: [execIn(), dataIn('question', 'question', 'string'), dataIn('context', 'context', 'context')], outputs: [dataOut('answer', 'answer', 'json'), dataOut('confidence', 'confidence', 'number'), execOut()], defaults: {} },
  { type: 'reflection', category: 'AI', title: 'Reflection', description: 'Self-review outputs.', icon: '◎', accent: '#B59CFF', shape: 'rounded', inputs: [execIn(), dataIn('result', 'result', 'json')], outputs: [dataOut('reflection', 'reflection', 'json'), execOut()], defaults: {} },
  { type: 'llm', category: 'AI', title: 'LLM', description: 'Model invocation node.', icon: '✦', accent: '#6C8CFF', shape: 'rounded', inputs: [execIn(), dataIn('prompt', 'prompt', 'prompt'), dataIn('context', 'context', 'context')], outputs: [dataOut('text', 'text', 'string'), dataOut('json', 'json', 'json'), execOut()], defaults: { config: { model: 'pcos-llm', temperature: 0.4, maxTokens: 2048 } } },
  { type: 'prompt', category: 'AI', title: 'Prompt', description: 'Build reusable prompts.', icon: '✎', accent: '#7F8EA3', shape: 'rounded', inputs: [dataIn('template', 'template', 'prompt'), dataIn('variables', 'variables', 'json')], outputs: [dataOut('prompt', 'prompt', 'prompt'), execOut()], defaults: {} },
  { type: 'embedding', category: 'AI', title: 'Embedding', description: 'Generate vectors.', icon: '◦', accent: '#37C98A', shape: 'rounded', inputs: [execIn(), dataIn('text', 'text', 'text')], outputs: [dataOut('embedding', 'embedding', 'embedding'), dataOut('vector', 'vector', 'vector')], defaults: {} },
  { type: 'evaluator', category: 'AI', title: 'Evaluator', description: 'Score or validate outputs.', icon: '✓', accent: '#37C98A', shape: 'rounded', inputs: [execIn(), dataIn('candidate', 'candidate', 'json'), dataIn('criteria', 'criteria', 'json')], outputs: [dataOut('score', 'score', 'number'), dataOut('result', 'result', 'json'), execOut()], defaults: {} },
  { type: 'sessionMemory', category: 'Memory', title: 'Session Memory', description: 'Short-lived session state.', icon: '◫', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('context', 'context', 'context')], outputs: [dataOut('memory', 'memory', 'memory'), dataOut('context', 'context', 'context')], defaults: {} },
  { type: 'persistentMemory', category: 'Memory', title: 'Persistent Memory', description: 'Durable memory storage.', icon: '◴', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('memory', 'memory', 'memory'), dataIn('provenance', 'provenance', 'json')], outputs: [dataOut('memory', 'memory', 'memory'), execOut()], defaults: {} },
  { type: 'semanticMemory', category: 'Memory', title: 'Semantic Memory', description: 'Meaning-based memory.', icon: '◌', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('memory', 'memory', 'memory'), dataIn('embedding', 'embedding', 'embedding')], outputs: [dataOut('knowledge', 'knowledge', 'knowledge'), dataOut('memory', 'memory', 'memory')], defaults: {} },
  { type: 'episodicMemory', category: 'Memory', title: 'Episodic Memory', description: 'Event history timeline.', icon: '⏺', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('event', 'event', 'event')], outputs: [dataOut('memory', 'memory', 'memory'), dataOut('timeline', 'timeline', 'json')], defaults: {} },
  { type: 'workingMemory', category: 'Memory', title: 'Working Memory', description: 'Active working context.', icon: '◫', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('context', 'context', 'context')], outputs: [dataOut('context', 'context', 'context'), dataOut('state', 'state', 'state')], defaults: {} },
  { type: 'memorySearch', category: 'Memory', title: 'Memory Search', description: 'Search memory stores.', icon: '⌕', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('filters', 'filters', 'json')], outputs: [dataOut('results', 'results', 'json'), execOut()], defaults: {} },
  { type: 'memoryWrite', category: 'Memory', title: 'Memory Write', description: 'Persist memory.', icon: '⇪', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('content', 'content', 'json'), dataIn('provenance', 'provenance', 'json')], outputs: [dataOut('memory', 'memory', 'memory'), execOut()], defaults: {} },
  { type: 'knowledgeSearch', category: 'Knowledge', title: 'Knowledge Search', description: 'Search the knowledge graph.', icon: '⌖', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('filters', 'filters', 'json')], outputs: [dataOut('results', 'results', 'json'), dataOut('knowledge', 'knowledge', 'knowledge')], defaults: {} },
  { type: 'vectorSearch', category: 'Knowledge', title: 'Vector Search', description: 'Nearest-neighbor search.', icon: '◌', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('queryEmbedding', 'queryEmbedding', 'embedding')], outputs: [dataOut('results', 'results', 'json'), dataOut('vector', 'vector', 'vector')], defaults: {} },
  { type: 'rag', category: 'Knowledge', title: 'RAG', description: 'Retrieve then generate.', icon: '◈', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('retrieval', 'retrieval', 'json'), dataIn('prompt', 'prompt', 'prompt')], outputs: [dataOut('answer', 'answer', 'json'), dataOut('sources', 'sources', 'json'), execOut()], defaults: {} },
  { type: 'documentSearch', category: 'Knowledge', title: 'Document Search', description: 'Search documents.', icon: '⌕', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('query', 'query', 'string')], outputs: [dataOut('results', 'results', 'json'), dataOut('snippets', 'snippets', 'json')], defaults: {} },
  { type: 'knowledgeGraph', category: 'Knowledge', title: 'Knowledge Graph', description: 'Inspect relationships.', icon: '◌', accent: '#37C98A', shape: 'group', inputs: [dataIn('entity', 'entity', 'entity'), dataIn('relationship', 'relationship', 'relationship')], outputs: [dataOut('graph', 'graph', 'json'), dataOut('knowledge', 'knowledge', 'knowledge')], defaults: {} },
  { type: 'retriever', category: 'Knowledge', title: 'Retriever', description: 'Unified retrieval.', icon: '☍', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('source', 'source', 'json')], outputs: [dataOut('context', 'context', 'context'), dataOut('results', 'results', 'json')], defaults: {} },
  { type: 'http', category: 'Tools', title: 'HTTP', description: 'Make HTTP requests.', icon: '↗', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('url', 'url', 'string'), dataIn('body', 'body', 'json')], outputs: [dataOut('response', 'response', 'json'), execOut()], defaults: {} },
  { type: 'restApi', category: 'Tools', title: 'REST API', description: 'Typed API call.', icon: 'API', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('endpoint', 'endpoint', 'string'), dataIn('params', 'params', 'json')], outputs: [dataOut('response', 'response', 'json'), execOut()], defaults: {} },
  { type: 'mcpTool', category: 'Tools', title: 'MCP Tool', description: 'Call MCP server tools.', icon: 'MCP', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('toolName', 'toolName', 'string'), dataIn('arguments', 'arguments', 'json')], outputs: [dataOut('result', 'result', 'json'), execOut()], defaults: {} },
  { type: 'browser', category: 'Tools', title: 'Browser', description: 'Automate browser flows.', icon: '◫', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('url', 'url', 'string'), dataIn('action', 'action', 'string')], outputs: [dataOut('page', 'page', 'json'), execOut()], defaults: {} },
  { type: 'python', category: 'Tools', title: 'Python', description: 'Run Python code.', icon: 'Py', accent: '#7F8EA3', shape: 'rounded', inputs: [dataIn('code', 'code', 'string'), dataIn('inputs', 'inputs', 'json')], outputs: [dataOut('output', 'output', 'json'), execOut()], defaults: {} },
  { type: 'javascript', category: 'Tools', title: 'JavaScript', description: 'Run JS code.', icon: 'JS', accent: '#E0A44B', shape: 'rounded', inputs: [dataIn('code', 'code', 'string'), dataIn('inputs', 'inputs', 'json')], outputs: [dataOut('output', 'output', 'json'), execOut()], defaults: {} },
  { type: 'sql', category: 'Tools', title: 'SQL', description: 'Query databases.', icon: 'SQL', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('params', 'params', 'json')], outputs: [dataOut('rows', 'rows', 'table'), execOut()], defaults: {} },
  { type: 'shell', category: 'Tools', title: 'Shell', description: 'Execute shell commands.', icon: '$', accent: '#93A0B5', shape: 'rounded', inputs: [dataIn('command', 'command', 'string'), dataIn('args', 'args', 'json')], outputs: [dataOut('stdout', 'stdout', 'text'), dataOut('stderr', 'stderr', 'text'), execOut()], defaults: {} },
  { type: 'calculator', category: 'Tools', title: 'Calculator', description: 'Deterministic math.', icon: '⊞', accent: '#7F8EA3', shape: 'rounded', inputs: [dataIn('expression', 'expression', 'string')], outputs: [dataOut('result', 'result', 'number'), execOut()], defaults: {} },
  { type: 'json', category: 'Data', title: 'JSON', description: 'Validate or transform JSON.', icon: '{}', accent: '#7F8EA3', shape: 'rounded', inputs: [dataIn('json', 'json', 'json')], outputs: [dataOut('object', 'object', 'object'), execOut()], defaults: {} },
  { type: 'csv', category: 'Data', title: 'CSV', description: 'Parse or export CSV.', icon: '[]', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('text', 'text', 'text')], outputs: [dataOut('table', 'table', 'table'), execOut()], defaults: {} },
  { type: 'xml', category: 'Data', title: 'XML', description: 'Parse or build XML.', icon: '</>', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('text', 'text', 'text')], outputs: [dataOut('document', 'document', 'document'), execOut()], defaults: {} },
  { type: 'file', category: 'Data', title: 'File', description: 'Read or write files.', icon: '⇵', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('path', 'path', 'string'), dataIn('content', 'content', 'text')], outputs: [dataOut('file', 'file', 'file'), dataOut('text', 'text', 'text')], defaults: {} },
  { type: 'database', category: 'Data', title: 'Database', description: 'Read or write DB records.', icon: '◫', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('query', 'query', 'string'), dataIn('record', 'record', 'json')], outputs: [dataOut('rows', 'rows', 'table'), execOut()], defaults: {} },
  { type: 'variable', category: 'Data', title: 'Variable', description: 'Store a variable.', icon: 'α', accent: '#7F8EA3', shape: 'pill', inputs: [dataIn('value', 'value')], outputs: [dataOut('value', 'value')], defaults: {} },
  { type: 'transformer', category: 'Data', title: 'Transformer', description: 'Transform data shapes.', icon: '⇄', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('input', 'input')], outputs: [dataOut('output', 'output'), execOut()], defaults: {} },
  { type: 'parser', category: 'Data', title: 'Parser', description: 'Parse text or files.', icon: '¶', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('text', 'text', 'text'), dataIn('file', 'file', 'file')], outputs: [dataOut('parsed', 'parsed', 'json'), execOut()], defaults: {} },
  { type: 'approval', category: 'Human', title: 'Approval', description: 'Pause for approval.', icon: '✓', accent: '#E0A44B', shape: 'rounded', inputs: [execIn(), dataIn('context', 'context', 'context')], outputs: [execOut('approved', 'approved'), execOut('rejected', 'rejected'), execOut('expired', 'expired')], defaults: {} },
  { type: 'feedback', category: 'Human', title: 'Feedback', description: 'Collect feedback.', icon: '✎', accent: '#6C8CFF', shape: 'rounded', inputs: [execIn(), dataIn('subject', 'subject', 'json')], outputs: [dataOut('feedback', 'feedback', 'json'), execOut()], defaults: {} },
  { type: 'chat', category: 'Human', title: 'Chat', description: 'Ask a human.', icon: '💬', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('message', 'message', 'text')], outputs: [dataOut('reply', 'reply', 'text'), execOut()], defaults: {} },
  { type: 'form', category: 'Human', title: 'Form', description: 'Collect structured input.', icon: '▦', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('schema', 'schema', 'json')], outputs: [dataOut('submission', 'submission', 'json'), execOut()], defaults: {} },
  { type: 'review', category: 'Human', title: 'Review', description: 'Review and sign off.', icon: '👁', accent: '#E0A44B', shape: 'rounded', inputs: [dataIn('draft', 'draft', 'json')], outputs: [execOut('approved', 'approved'), execOut('changes', 'changes')], defaults: {} },
  { type: 'email', category: 'Communication', title: 'Email', description: 'Draft or send email.', icon: '✉', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('to', 'to', 'string'), dataIn('body', 'body', 'text')], outputs: [execOut('sent', 'sent'), execOut('draft', 'draft')], defaults: {} },
  { type: 'slack', category: 'Communication', title: 'Slack', description: 'Draft or post Slack messages.', icon: '#', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('channel', 'channel', 'string'), dataIn('message', 'message', 'text')], outputs: [execOut('posted', 'posted'), execOut('draft', 'draft')], defaults: {} },
  { type: 'discord', category: 'Communication', title: 'Discord', description: 'Post Discord messages.', icon: '◇', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('channel', 'channel', 'string'), dataIn('message', 'message', 'text')], outputs: [execOut('posted', 'posted')], defaults: {} },
  { type: 'teams', category: 'Communication', title: 'Teams', description: 'Send Teams messages.', icon: 'T', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('channel', 'channel', 'string'), dataIn('message', 'message', 'text')], outputs: [execOut('posted', 'posted')], defaults: {} },
  { type: 'sms', category: 'Communication', title: 'SMS', description: 'Send SMS messages.', icon: '☎', accent: '#E0A44B', shape: 'rounded', inputs: [dataIn('to', 'to', 'string'), dataIn('message', 'message', 'text')], outputs: [execOut('sent', 'sent'), execOut('failed', 'failed')], defaults: {} },
  { type: 'webhook', category: 'Communication', title: 'Webhook', description: 'Emit webhook events.', icon: '↗', accent: '#6C8CFF', shape: 'rounded', inputs: [dataIn('url', 'url', 'string'), dataIn('payload', 'payload', 'json')], outputs: [execOut('delivered', 'delivered')], defaults: {} },
  { type: 'response', category: 'Output', title: 'Response', description: 'Return final response.', icon: '↩', accent: '#F4F7FB', shape: 'pill', inputs: [dataIn('content', 'content', 'json')], outputs: [dataOut('response', 'response', 'json')], defaults: {} },
  { type: 'report', category: 'Output', title: 'Report', description: 'Generate a report artifact.', icon: '▤', accent: '#6C8CFF', shape: 'rounded', inputs: [execIn(), dataIn('sections', 'sections', 'memory')], outputs: [dataOut('report', 'report', 'document'), execOut()], defaults: {} },
  { type: 'dashboard', category: 'Output', title: 'Dashboard', description: 'Generate an operational dashboard artifact.', icon: '▦', accent: '#7F8EA3', shape: 'group', inputs: [dataIn('metrics', 'metrics', 'json')], outputs: [dataOut('dashboard', 'dashboard', 'json')], defaults: {} },
  { type: 'export', category: 'Output', title: 'Export', description: 'Export workflow artifacts.', icon: '⇪', accent: '#A98BFF', shape: 'rounded', inputs: [dataIn('content', 'content', 'json')], outputs: [dataOut('file', 'file', 'file'), execOut()], defaults: {} },
  { type: 'download', category: 'Output', title: 'Download', description: 'Prepare downloadable file.', icon: '⇣', accent: '#37C98A', shape: 'rounded', inputs: [dataIn('file', 'file', 'file')], outputs: [dataOut('download', 'download', 'file')], defaults: {} },
];

export const NODE_PRESET_MAP = new Map<WorkflowNodeType, NodePreset>(NODE_PRESETS.map((preset) => [preset.type, preset]));

export const buildNodeData = (type: WorkflowNodeType, overrides: Partial<WorkflowNodeData> = {}): WorkflowNodeData => {
  const preset = NODE_PRESET_MAP.get(type);
  if (!preset) {
    throw new Error(`Unknown node type: ${type}`);
  }

  return {
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
    ...overrides,
  };
};

export const NODE_LIBRARY_GROUPS: Array<{ category: NodeCategory; label: string; types: WorkflowNodeType[] }> = [
  { category: 'Flow', label: 'Flow', types: ['start', 'end', 'event', 'trigger', 'scheduler', 'delay', 'wait', 'stop'] },
  { category: 'Logic', label: 'Logic', types: ['condition', 'switch', 'router', 'merge', 'parallel', 'loop', 'retry', 'errorHandler'] },
  { category: 'AI', label: 'AI', types: ['agent', 'supervisor', 'planner', 'reasoner', 'reflection', 'llm', 'prompt', 'embedding', 'evaluator'] },
  { category: 'Memory', label: 'Memory', types: ['sessionMemory', 'persistentMemory', 'semanticMemory', 'episodicMemory', 'workingMemory', 'memorySearch', 'memoryWrite'] },
  { category: 'Knowledge', label: 'Knowledge', types: ['knowledgeSearch', 'vectorSearch', 'rag', 'documentSearch', 'knowledgeGraph', 'retriever'] },
  { category: 'Tools', label: 'Tools', types: ['http', 'restApi', 'mcpTool', 'browser', 'python', 'javascript', 'sql', 'shell', 'calculator'] },
  { category: 'Data', label: 'Data', types: ['json', 'csv', 'xml', 'file', 'database', 'variable', 'transformer', 'parser'] },
  { category: 'Human', label: 'Human', types: ['approval', 'feedback', 'chat', 'form', 'review'] },
  { category: 'Communication', label: 'Communication', types: ['email', 'slack', 'discord', 'teams', 'sms', 'webhook'] },
  { category: 'Output', label: 'Output', types: ['response', 'report', 'dashboard', 'export', 'download'] },
];

export const INITIAL_GRAPH_NODES: Node<WorkflowNodeData>[] = [
  { id: 'start-1', type: 'workflowNode', position: { x: 120, y: 160 }, data: buildNodeData('start', { title: 'Workflow Start', config: { runtimeBinding: 'workflow-start' }, runtime: { status: 'idle' } }) },
  { id: 'planner-1', type: 'workflowNode', position: { x: 360, y: 140 }, data: buildNodeData('planner', { title: 'Planner', runtime: { status: 'idle', version: 'v1' }, config: { notes: 'Decompose task into execution steps' } }) },
  { id: 'retriever-1', type: 'workflowNode', position: { x: 360, y: 330 }, data: buildNodeData('retriever', { title: 'Context Retriever', runtime: { status: 'idle' }, config: { knowledgeScope: 'workspace' } }) },
  { id: 'agent-1', type: 'workflowNode', position: { x: 660, y: 120 }, data: buildNodeData('agent', { title: 'Research Agent', runtime: { status: 'running', step: 'Gather sources', tokens: 1180, cost: 0.42, latencyMs: 86 } }) },
  { id: 'llm-1', type: 'workflowNode', position: { x: 660, y: 320 }, data: buildNodeData('llm', { title: 'Draft LLM', runtime: { status: 'waiting', step: 'Waiting for context' }, config: { model: 'pcos-llm', temperature: 0.35 } }) },
  { id: 'parallel-1', type: 'workflowNode', position: { x: 980, y: 160 }, data: buildNodeData('parallel', { title: 'Parallel Analysis', runtime: { status: 'idle' } }) },
  { id: 'approval-1', type: 'workflowNode', position: { x: 1280, y: 120 }, data: buildNodeData('approval', { title: 'Human Approval', runtime: { status: 'paused' } }) },
  { id: 'memory-1', type: 'workflowNode', position: { x: 1280, y: 330 }, data: buildNodeData('persistentMemory', { title: 'Write Memory', runtime: { status: 'idle' } }) },
  { id: 'output-1', type: 'workflowNode', position: { x: 1560, y: 210 }, data: buildNodeData('report', { title: 'Final Report', runtime: { status: 'idle' } }) },
];

export const INITIAL_GRAPH_EDGES = [
  { id: 'e-start-planner', source: 'start-1', target: 'planner-1', sourceHandle: 'out', targetHandle: 'in', type: 'workflowEdge', data: { kind: 'execution', animated: true, validated: true } },
  { id: 'e-planner-retriever', source: 'planner-1', target: 'retriever-1', sourceHandle: 'out', targetHandle: 'query', type: 'workflowEdge', data: { kind: 'knowledge', animated: true, validated: true } },
  { id: 'e-retriever-agent', source: 'retriever-1', target: 'agent-1', sourceHandle: 'results', targetHandle: 'context', type: 'workflowEdge', data: { kind: 'memory', animated: true, validated: true } },
  { id: 'e-agent-llm', source: 'agent-1', target: 'llm-1', sourceHandle: 'out', targetHandle: 'in', type: 'workflowEdge', data: { kind: 'execution', animated: true, validated: true } },
  { id: 'e-agent-parallel', source: 'agent-1', target: 'parallel-1', sourceHandle: 'result', targetHandle: 'in', type: 'workflowEdge', data: { kind: 'execution', animated: true, validated: true } },
  { id: 'e-parallel-approval', source: 'parallel-1', target: 'approval-1', sourceHandle: 'a', targetHandle: 'in', type: 'workflowEdge', data: { kind: 'conditional', animated: true, validated: true } },
  { id: 'e-parallel-memory', source: 'parallel-1', target: 'memory-1', sourceHandle: 'b', targetHandle: 'memory', type: 'workflowEdge', data: { kind: 'memory', animated: true, validated: true } },
  { id: 'e-approval-output', source: 'approval-1', target: 'output-1', sourceHandle: 'approved', targetHandle: 'in', type: 'workflowEdge', data: { kind: 'execution', animated: true, validated: true } },
  { id: 'e-memory-output', source: 'memory-1', target: 'output-1', sourceHandle: 'memory', targetHandle: 'sections', type: 'workflowEdge', data: { kind: 'memory', animated: true, validated: true } },
];
