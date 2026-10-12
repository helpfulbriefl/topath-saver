import { AlertTriangle } from 'lucide-react';
import { useId, useState } from 'react';
import { ICON_NAMES } from '../../../lib/defaults';
import { t, type Key } from '../../../lib/i18n';
import { normalizeFolder, validateFolder } from '../../../lib/paths';
import type { IconName, PresetId } from '../../../lib/types';
import { PRESET_ICONS } from '../components/icons';
import { CloseButton, Header } from '../components/ui';
import type { ViewProps } from './types';

export function PresetView({ state, update, go, id }: ViewProps & { id: PresetId }) {
  const lang = state.settings.lang;
  const preset = state.presets.find((p) => p.id === id)!;
  const [name, setName] = useState(preset.name ?? '');
  const [folder, setFolder] = useState(preset.folder);
  const [icon, setIcon] = useState<IconName>(preset.icon);
  const errors = validateFolder(folder);
  const nameId = useId();
  const folderId = useId();

  const save = () => {
    if (errors.length) return;
    update((s) => ({
      ...s,
      presets: s.presets.map((p) => (p.id === id ? { ...p, name: name.trim() || null, folder: normalizeFolder(folder), icon } : p)),
    }));
    go({ name: 'settings' });
  };

  return (
    <main>
      <Header title={t(lang, 'preset.title')} onBack={() => go({ name: 'settings' })} backLabel={t(lang, 'a11y.back')} right={<CloseButton label={t(lang, 'a11y.close')} onClick={() => window.close()} />} />
      <form className="flex flex-col gap-3.5 p-4" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
        <div>
          <label htmlFor={nameId} className="mb-1.5 block text-[12.5px] font-semibold">{t(lang, 'preset.name')}</label>
          <div className="field"><input id={nameId} className="min-w-0 flex-1 bg-transparent outline-none" value={name} maxLength={40} placeholder={t(lang, `preset.${id}` as Key)} onChange={(e) => setName(e.target.value)} /></div>
        </div>
        <div>
          <label htmlFor={folderId} className="mb-1.5 block text-[12.5px] font-semibold">{t(lang, 'preset.folder')}</label>
          <div className={`field ${errors.length ? 'field-err' : ''}`}>
            <span className="mono text-mut">Downloads/</span>
            <input id={folderId} className="mono min-w-0 flex-1 bg-transparent outline-none" value={folder} spellCheck={false} aria-invalid={errors.length > 0} onChange={(e) => setFolder(e.target.value)} />
          </div>
          {errors.length ? (
            <ul className="mt-2 flex flex-col gap-1 text-xs text-err" role="alert">
              {errors.map((e) => <li key={e} className="flex items-start gap-1.5"><AlertTriangle size={13} className="mt-px shrink-0" aria-hidden />{t(lang, `err.${e}` as Key)}</li>)}
            </ul>
          ) : null}
        </div>
        <fieldset>
          <legend className="mb-1.5 text-[12.5px] font-semibold">{t(lang, 'preset.icon')}</legend>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={t(lang, 'preset.icon')}>
            {ICON_NAMES.map((n) => {
              const Icon = PRESET_ICONS[n];
              return (
                <button key={n} type="button" role="radio" aria-checked={icon === n} aria-label={n} onClick={() => setIcon(n)} className={`icon-btn h-10 w-full ${icon === n ? 'icon-btn-on' : ''}`}>
                  <Icon size={16} aria-hidden />
                </button>
              );
            })}
          </div>
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={errors.length > 0}>{t(lang, 'preset.save')}</button>
      </form>
    </main>
  );
}
