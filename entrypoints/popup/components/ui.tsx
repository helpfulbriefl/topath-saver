import { ChevronLeft, X, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function IconButton({ label, icon: Icon, onClick }: { label: string; icon: LucideIcon; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="icon-btn">
      <Icon size={15} aria-hidden />
    </button>
  );
}

export function Header({ title, logo, right, onBack, backLabel }: {
  title: string; logo?: ReactNode; right?: ReactNode; onBack?: () => void; backLabel?: string;
}) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {onBack ? <IconButton label={backLabel ?? 'Back'} icon={ChevronLeft} onClick={onBack} /> : logo}
        <h1 className="truncate text-[15px] font-bold">{title}</h1>
      </div>
      {right}
    </header>
  );
}

export function CloseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <IconButton label={label} icon={X} onClick={onClick} />;
}

export function Check({ checked, disabled, onChange, children }: {
  checked: boolean; disabled?: boolean; onChange: (v: boolean) => void; children: ReactNode;
}) {
  return (
    <label className={`flex items-center gap-2.5 text-[13px] ${disabled ? 'opacity-45' : 'cursor-pointer'}`}>
      <input type="checkbox" className="check" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  );
}

export function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="switch">
      <span />
    </button>
  );
}

export function SettingRow({ title, sub, children }: { title: string; sub?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold">{title}</div>
        {sub ? <div className="text-xs text-mut">{sub}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 pb-1.5 pt-1 text-[11px] uppercase tracking-[.08em] text-mut">{children}</div>;
}
