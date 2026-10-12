import { AlertTriangle, Check as CheckIcon, Pencil, Settings, Sparkles, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { MODE_ORDER } from '../../../lib/defaults';
import { relTime, t } from '../../../lib/i18n';
import { TYPE_RULES } from '../../../lib/rules';
import type { ModeId, Preset, State } from '../../../lib/types';
import { CustomIcon, DefaultIcon, PRESET_ICONS } from '../components/icons';
import { Check, Header, IconButton, SectionLabel } from '../components/ui';
import type { ViewProps } from './types';

export const presetName = (s: State, p: Preset) => p.name ?? t(s.settings.lang, `preset.${p.id}`);

function useShortcuts(enabled: boolean): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!enabled) return;
    void browser.commands.getAll().then((cmds) => {
      const m: Record<string, string> = {};
      for (const c of cmds) if (c.name && c.shortcut) m[c.name] = c.shortcut;
      setMap(m);
    }).catch(() => undefined);
  }, [enabled]);
  return enabled ? map : {};
}

export function Logo() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-paper">
      <DefaultIcon size={15} aria-hidden />
    </span>
  );
}

export function MainView({ state, update, go }: ViewProps) {
  const lang = state.settings.lang;
  const keys = useShortcuts(state.settings.shortcuts);
  const select = (mode: ModeId) => {
    if (mode === 'custom' && !state.customFolder) return go({ name: 'custom' });
    update((s) => ({ ...s, mode, once: mode === 'default' ? false : s.once }));
  };

  const rows = MODE_ORDER.map((mode, i) => {
    const shortcut = keys[`mode-${i + 1}`];
    if (mode === 'default') {
      return { mode, Icon: DefaultIcon, title: t(lang, 'mode.default'), sub: state.downloadsRoot ?? t(lang, 'mode.defaultSub'), shortcut };
    }
    if (mode === 'custom') {
      return { mode, Icon: CustomIcon, title: t(lang, 'mode.custom'), sub: state.customFolder ? `Downloads/${state.customFolder}` : t(lang, 'mode.customEmpty'), shortcut };
    }
    const p = state.presets.find((x) => x.id === mode)!;
    return { mode, Icon: PRESET_ICONS[p.icon], title: presetName(state, p), sub: `Downloads/${p.folder}`, shortcut };
  });

  return (
    <main>
      <Header title="ToPath Saver" logo={<Logo />} right={<IconButton label={t(lang, 'a11y.settings')} icon={Settings} onClick={() => go({ name: 'settings' })} />} />
      {state.autoSort ? (
        <section className="px-2 py-2.5">
          <div className="mx-1 mb-2 flex items-center gap-2.5 rounded-lg bg-ok-soft px-3 py-2.5">
            <Sparkles size={16} className="text-ok" aria-hidden />
            <div>
              <div className="text-[13px] font-bold">{t(lang, 'auto.on')}</div>
              <div className="text-xs text-ok-ink">{t(lang, 'auto.onSub')}</div>
            </div>
          </div>
          <SectionLabel>{t(lang, 'auto.rules')}</SectionLabel>
          <ul>
            {state.presets.map((p) => {
              const Icon = PRESET_ICONS[p.icon];
              return (
                <li key={p.id} className="row">
                  <span className="row-icon"><Icon size={16} aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{presetName(state, p)}</span>
                    <span className="mono block truncate text-[11.5px] text-mut">{TYPE_RULES[p.id].slice(0, 5).join(', ')}…</span>
                  </span>
                </li>
              );
            })}
            <li className="row">
              <span className="row-icon"><DefaultIcon size={16} aria-hidden /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{t(lang, 'auto.else')}</span>
                <span className="mono block text-[11.5px] text-mut">{t(lang, 'auto.elseSub')}</span>
              </span>
            </li>
          </ul>
        </section>
      ) : (
        <section className="px-2 py-2.5">
          <SectionLabel>{t(lang, 'main.saveTo')}</SectionLabel>
          <div role="radiogroup" aria-label={t(lang, 'a11y.modes')}>
            {rows.map(({ mode, Icon, title, sub, shortcut }) => {
              const on = state.mode === mode;
              return (
                <div key={mode} className="relative">
                  <button type="button" role="radio" aria-checked={on} onClick={() => select(mode)} className={`row w-full text-left ${on ? 'row-on' : ''}`}>
                    <span className="radio" aria-hidden />
                    <span className="row-icon"><Icon size={16} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="mono block truncate text-[11.5px] text-mut">{sub}</span>
                    </span>
                    {shortcut && mode !== 'custom' ? <kbd className="kbd">{shortcut}</kbd> : null}
                    {mode === 'custom' ? <span className="w-8 shrink-0" aria-hidden /> : null}
                  </button>
                  {mode === 'custom' ? (
                    <button type="button" aria-label={t(lang, 'mode.editCustom')} title={t(lang, 'mode.editCustom')} onClick={() => go({ name: 'custom' })} className="icon-btn absolute right-2.5 top-1/2 -translate-y-1/2">
                      <Pencil size={14} aria-hidden />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      )}
      <footer className="flex flex-col gap-2.5 border-t border-line bg-soft px-4 py-3">
        <Check checked={state.autoSort} onChange={(v) => update((s) => ({ ...s, autoSort: v }))}>{t(lang, 'opt.autoSort')}</Check>
        <Check checked={state.once} disabled={state.autoSort || state.mode === 'default'} onChange={(v) => update((s) => ({ ...s, once: v }))}>{t(lang, 'opt.once')}</Check>
        <LastLine state={state} />
      </footer>
    </main>
  );
}

function LastLine({ state }: { state: State }) {
  const last = state.last;
  if (!last) return null;
  const lang = state.settings.lang;
  const when = relTime(lang, last.at);
  if (last.status === 'ok') {
    return (
      <p className="flex items-center gap-1.5 text-xs text-mut" role="status">
        <CheckIcon size={13} className="shrink-0 text-ok" aria-hidden />
        <span className="truncate">{t(lang, 'last.ok', { file: last.file, folder: last.folder ? `${last.folder}/` : 'Downloads' })} · {when}</span>
      </p>
    );
  }
  const Icon = last.status === 'conflict' ? AlertTriangle : XCircle;
  return (
    <p className={`flex items-center gap-1.5 text-xs ${last.status === 'conflict' ? 'text-warn' : 'text-err'}`} role="status">
      <Icon size={13} className="shrink-0" aria-hidden />
      <span className="truncate">{t(lang, last.status === 'conflict' ? 'last.conflict' : 'last.error', { file: last.file })} · {when}</span>
    </p>
  );
}
