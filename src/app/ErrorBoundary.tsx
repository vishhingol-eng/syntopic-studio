import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.error('Syntopic Studio error boundary caught an error:', error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-bg px-6 text-center text-text">
          <div className="max-w-xl rounded-3xl border border-white/8 bg-panel px-8 py-8 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Application error</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-100">Syntopic Studio hit a recoverable error.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The editor encountered an unexpected problem. Reloading usually restores the workspace state.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl border border-accent/35 bg-accent/15 px-4 py-3 text-sm font-semibold text-white hover:bg-accent/20"
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
