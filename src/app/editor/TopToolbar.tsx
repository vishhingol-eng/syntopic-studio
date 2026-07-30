import { useEditorStore } from './editor-store';

function ToolbarButton({
  label,
  hint,
  tone = 'default',
  onClick,
}: {
  label: string;
  hint?: string;
  tone?: 'default' | 'accent' | 'success' | 'warning';
  onClick: () => void;
}) {
  const styles: Record<'default' | 'accent' | 'success' | 'warning', string> = {
    default: 'border-white/8 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]',
    accent: 'border-accent/35 bg-accent/14 text-white hover:bg-accent/20',
    success: 'border-success/30 bg-success/12 text-white hover:bg-success/18',
    warning: 'border-warning/30 bg-warning/12 text-white hover:bg-warning/18',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[12px] font-semibold transition ${styles[tone]}`}
    >
      <span>{label}</span>
      {hint ? <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-mono text-slate-300">{hint}</span> : null}
    </button>
  );
}

export default function TopToolbar() {
  const runtimeStatus = useEditorStore((state) => state.runtimeStatus);
  const runWorkflow = useEditorStore((state) => state.runWorkflow);
  const pauseWorkflow = useEditorStore((state) => state.pauseWorkflow);
  const resumeWorkflow = useEditorStore((state) => state.resumeWorkflow);
  const stepWorkflow = useEditorStore((state) => state.stepWorkflow);
  const deployWorkflow = useEditorStore((state) => state.deployWorkflow);
  const setActiveConsoleTab = useEditorStore((state) => state.setActiveConsoleTab);
  const lastAction = useEditorStore((state) => state.lastAction);

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/6 bg-[rgba(17,24,35,0.96)] px-5 shadow-panel backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-gradient-to-br from-accent/20 to-white/5 text-sm font-bold text-white">
          SS
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Syntopic Studio / PCOS</div>
          <div className="truncate text-[18px] font-semibold tracking-[-0.02em] text-slate-100">AI Engineering Workspace</div>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3 overflow-hidden">
        <ToolbarButton label="Run" hint="⌘⏎" tone="accent" onClick={runWorkflow} />
        <ToolbarButton label="Pause" hint="Space" tone="warning" onClick={pauseWorkflow} />
        <ToolbarButton label="Resume" hint="⇧⏎" tone="success" onClick={resumeWorkflow} />
        <ToolbarButton label="Debug" hint="F8" onClick={() => setActiveConsoleTab('debug')} />
        <ToolbarButton label="Step" hint="F6" onClick={stepWorkflow} />
        <ToolbarButton label="Deploy" hint="⇧⌘D" tone="accent" onClick={deployWorkflow} />
        <ToolbarButton label="Version History" onClick={() => setActiveConsoleTab('timeline')} />
        <ToolbarButton label="Share" onClick={() => setActiveConsoleTab('console')} />
        <ToolbarButton label="Settings" onClick={() => setActiveConsoleTab('debug')} />
      </div>

      <div className="flex items-center gap-3 text-right">
        <div className="hidden min-w-[220px] rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-2 lg:block">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Last action</div>
          <div className="truncate text-[12px] font-medium text-slate-200">{lastAction}</div>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[12px] font-semibold text-slate-200">
          {runtimeStatus.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
