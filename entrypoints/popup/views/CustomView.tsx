import { AlertTriangle, Info } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { t, type Key } from '../../../lib/i18n';
import { normalizeFolder, sanitizeFolder, validateFolder } from '../../../lib/paths';
import { pushRecent } from '../../../lib/state';
import { CloseButton, Header } from '../components/ui';
import type { ViewProps } from './types';

export function CustomView({ state, update, go }: ViewProps) {
  const lang = state.settings.lang;
  const [value, setValue] = useState(state.customFolder);
  const [touched, setTouched] = useState(false);
  const errors = useMemo(() => validateFolder(value), [value]);
  const ok = errors.length === 0;
  const showErr = touched && !ok;
  const inputId = useId();
  const root = state.downloadsRoot ?? '~/Downloads';
  const preview = ok ? `${root}/${normalizeFolder(value)}/` : `${root}/${sanitizeFolder(value) || '…'}/`;

  const save = () => {
    if (!ok) { setTouched(true); return; }
    const folder = normalizeFolder(value);
    update((s) => ({ ...s, customFolder: folder, recentCustom: pushRecent(s.recentCustom, folder), mode: 'custom', autoSort: false }));
    go({ name: 'main' });
  };

  return (
    <main>
      <Header title={t(lang, 'custom.title')} onBack={() => go({ name: 'main' })} backLabel={t(lang, 'a11y.back')} right={<CloseButton label={t(lang, 'a11y.close')} onClick={() => window.close()} />} />
      <form className="flex flex-col gap-3.5 p-4" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-[12.5px] font-semibold">{t(lang, 'custom.label')}</label>
          <div className={`field ${showErr ? 'field-err' : ''}`}>
            <span className="mono text-mut">Downloads/</span>
            <input
              id={inputId}
              className="mono min-w-0 flex-1 bg-transparent outline-none"
              value={value}
              autoFocus
              spellCheck={false}
              placeholder="Work/Projects"
              aria-invalid={showErr}
              aria-describedby={showErr ? `${inputId}-err` : `${inputId}-hint`}
              onChange={(e) => { setValue(e.target.value); setTouched(true); }}
            />
          </div>
          {showErr ? (
            <ul id={`${inputId}-err`} className="mt-2 flex flex-col gap-1 text-xs text-err" role="alert">
              {errors.map((e) => (
                <li key={e} className="flex items-start gap-1.5"><AlertTriangle size={13} className="mt-px shrink-0" aria-hidden />{t(lang, `err.${e}` as Key)}</li>
              ))}
            </ul>
          ) : (
            <p id={`${inputId}-hint`} className="mt-2 flex items-start gap-1.5 text-xs text-mut"><Info size={13} className="mt-px shrink-0" aria-hidden />{t(lang, 'custom.hint')}</p>
          )}
        </div>
        <div>
          <div className="mb-1.5 text-[12.5px] font-semibold">{t(lang, 'custom.preview')}</div>
          <div className="field mono bg-soft text-xs text-mut"><span className="truncate">{preview}</span></div>
        </div>
        {state.recentCustom.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {state.recentCustom.map((r) => (
              <button key={r} type="button" className="chip mono" onClick={() => { setValue(r); setTouched(true); }}>{r}</button>
            ))}
            <span className="text-[11.5px] text-mut">{t(lang, 'custom.recent')}</span>
          </div>
        ) : null}
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost flex-1" disabled={ok || !sanitizeFolder(value)} onClick={() => { setValue(sanitizeFolder(value)); setTouched(true); }}>{t(lang, 'custom.fix')}</button>
          <button type="submit" className="btn btn-primary flex-1" disabled={!ok}>{t(lang, 'custom.save')}</button>
        </div>
      </form>
    </main>
  );
}
