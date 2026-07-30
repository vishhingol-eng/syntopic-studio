import type { Connection, Node } from '@xyflow/react';
import type { WorkflowEdgeData, WorkflowNodeData } from './editor-types';

const COMPATIBILITY: Record<string, string[]> = {
  exec: ['exec'],
  data: ['data', 'json', 'text', 'object', 'table', 'file', 'document', 'state', 'context', 'prompt'],
  control: ['control', 'boolean', 'condition'],
  signal: ['signal', 'event'],
  context: ['context', 'memory', 'knowledge', 'state'],
  memory: ['memory', 'context', 'knowledge'],
  knowledge: ['knowledge', 'context', 'memory', 'vector', 'embedding', 'entity', 'relationship'],
  prompt: ['prompt', 'text'],
  text: ['text', 'prompt', 'string'],
  json: ['json', 'object', 'data'],
  object: ['object', 'json'],
  array: ['array', 'json'],
  number: ['number'],
  boolean: ['boolean'],
  string: ['string', 'text', 'prompt'],
  table: ['table', 'json'],
  document: ['document', 'file', 'text'],
  file: ['file', 'document'],
  image: ['image', 'file'],
  embedding: ['embedding', 'vector'],
  vector: ['vector', 'embedding'],
  entity: ['entity', 'knowledge'],
  relationship: ['relationship', 'knowledge'],
  tool: ['tool'],
  agent: ['agent'],
  workflow: ['workflow'],
  state: ['state', 'context', 'memory'],
  error: ['error'],
  event: ['event', 'signal'],
  approval: ['approval', 'control'],
  credential: ['credential', 'secret'],
  secret: ['secret', 'credential'],
};

export const getPort = (node: Node<WorkflowNodeData> | undefined, portId: string | null | undefined, direction: 'inputs' | 'outputs') => {
  if (!node || !portId) return undefined;
  const ports = node.data[direction] as Array<{ id: string; type: string; label: string }> | undefined;
  return ports?.find((port) => port.id === portId);
};

export const validateConnectionTypes = (connection: Connection, nodes: Node<WorkflowNodeData>[]) => {
  if (!connection.source || !connection.target) return false;
  if (connection.source === connection.target) return false;

  const sourceNode = nodes.find((node) => node.id === connection.source);
  const targetNode = nodes.find((node) => node.id === connection.target);
  const sourcePort = getPort(sourceNode, connection.sourceHandle, 'outputs');
  const targetPort = getPort(targetNode, connection.targetHandle, 'inputs');

  if (!sourcePort || !targetPort) return false;
  if (sourcePort.type === targetPort.type) return true;

  const allowed = COMPATIBILITY[sourcePort.type] ?? [];
  return allowed.includes(targetPort.type);
};

export const inferEdgeKind = (connection: Connection, nodes: Node<WorkflowNodeData>[]): WorkflowEdgeData['kind'] => {
  const sourceNode = nodes.find((node) => node.id === connection.source);
  const targetNode = nodes.find((node) => node.id === connection.target);
  const sourcePort = getPort(sourceNode, connection.sourceHandle, 'outputs');
  const targetPort = getPort(targetNode, connection.targetHandle, 'inputs');

  const sourceType = sourcePort?.type ?? 'exec';
  const targetType = targetPort?.type ?? 'exec';

  if (sourceType === 'event' || targetType === 'event' || sourceType === 'signal' || targetType === 'signal') return 'event';
  if (sourceType === 'memory' || targetType === 'memory' || sourceType === 'context' || targetType === 'context') return 'memory';
  if (sourceType === 'knowledge' || targetType === 'knowledge' || sourceType === 'vector' || targetType === 'vector' || sourceType === 'embedding' || targetType === 'embedding') return 'knowledge';
  if (sourceType === 'boolean' || targetType === 'boolean' || sourceType === 'control' || targetType === 'control' || sourceType === 'approval' || targetType === 'approval') return 'conditional';
  if (sourceType === 'data' || targetType === 'data') return 'data';
  return 'execution';
};

export const edgeKinds: Array<WorkflowEdgeData['kind']> = ['execution', 'data', 'memory', 'knowledge', 'conditional', 'event'];
