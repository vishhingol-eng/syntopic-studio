import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import LeftExplorer from './LeftExplorer';
import TopToolbar from './TopToolbar';
import GraphCanvas from './GraphCanvas';
import RightInspector from './RightInspector';
import BottomConsole from './BottomConsole';
import { useEditorStore } from './editor-store';

function useKeyboardShortcuts() {
  const runWorkflow = useEditorStore((state) => state.runWorkflow);
  const pauseWorkflow = useEditorStore((state) => state.pauseWorkflow);
  const resumeWorkflow = useEditorStore((state) => state.resumeWorkflow);
  const stepWorkflow = useEditorStore((state) => state.stepWorkflow);
  const deleteSelection = useEditorStore((state) => state.deleteSelection);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setActiveConsoleTab = useEditorStore((state) => state.setActiveConsoleTab);
  const clearSelection = useEditorStore((state) => state.selectNode);
  const clearEdgeSelection = useEditorStore((state) => state.selectEdge);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key === 'Enter') {
        event.preventDefault();
        runWorkflow();
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement | null;
        const editable = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
        if (!editable) {
          event.preventDefault();
          deleteSelection();
        }
      }

      if (meta && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      if ((meta && event.key.toLowerCase() === 'z' && event.shiftKey) || (meta && event.key.toLowerCase() === 'y')) {
        event.preventDefault();
        redo();
      }

      if (event.key === 'F6') {
        event.preventDefault();
        stepWorkflow();
      }

      if (event.key === 'F8') {
        event.preventDefault();
        pauseWorkflow();
        setActiveConsoleTab('debug');
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        clearSelection(null);
        clearEdgeSelection(null);
      }

      if (event.key === ' ' && !meta) {
        // keep the shortcut reserved for future space-pan mode; prevent accidental page scroll.
        event.preventDefault();
      }

      if (event.key === 'F5') {
        event.preventDefault();
        resumeWorkflow();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelection, pauseWorkflow, redo, resumeWorkflow, runWorkflow, setActiveConsoleTab, stepWorkflow, undo]);
}

export function GraphEditor() {
  useKeyboardShortcuts();

  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-bg text-text">
        <TopToolbar />
        <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)_380px]">
          <LeftExplorer />
          <GraphCanvas />
          <RightInspector />
        </div>
        <BottomConsole />
      </div>
    </ReactFlowProvider>
  );
}
