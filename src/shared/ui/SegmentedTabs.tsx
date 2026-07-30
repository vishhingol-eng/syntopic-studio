export interface SegmentedTabOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

interface SegmentedTabsProps<T extends string> {
  value: T;
  options: Array<SegmentedTabOption<T>>;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedTabs<T extends string>({ value, options, onChange, className }: SegmentedTabsProps<T>) {
  return (
    <div className={`grid gap-2 rounded-2xl border border-white/6 bg-white/[0.03] p-1 ${className ?? ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl px-3 py-2 text-[12px] font-semibold transition ${value === option.value ? 'bg-accent/16 text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}`}
        >
          <span className="flex items-center justify-between gap-2">
            <span>{option.label}</span>
            {option.badge ? <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-mono text-slate-300">{option.badge}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
