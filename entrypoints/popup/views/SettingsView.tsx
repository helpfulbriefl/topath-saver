import { Activity, Check, Code, Coffee, Copy, ExternalLink, Keyboard, RotateCcw, Send, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import qrUrl from '../../../assets/eth-qr.svg?url';
import { CONTACT_URL, ETH_ADDRESS, ETH_URI, REPO_URL, SHORTCUTS_URL } from '../../../lib/config';
import { makeDefaultState } from '../../../lib/defaults';
import { LANG_LABELS, t } from '../../../lib/i18n';
import { readDiag } from '../../../lib/storage';
import type { Lang, Settings } from '../../../lib/types';
import { PRESET_ICONS } from '../components/icons';
import { CloseButton, Header, SettingRow, Switch } from '../components/ui';
import { presetName } from './MainView';
import type { ViewProps } from './types';

const LANGS: Lang[] = ['en', 'ru', 'zh', 'es'];

export function SettingsView({ state, update, go }: ViewProps) {
  const lang = state.settings.lang;
  const set = (patch: Partial<Settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    if (!confirmReset) return;
    const id = setTimeout(() => setConfirmReset(false), 3000);
    return () => clearTimeout(id);
  }, [confirmReset]);
  const version = browser.runtime.getManifest().version;

  return (
    <main>
      <Header title={t(lang, 'set.title')} onBack={() => go({ name: 'main' })} backLabel={t(lang, 'a11y.back')} right={<CloseButton label={t(lang, 'a11y.close')} onClick={() => window.close()} />} />
      <SettingRow title={t(lang, 'set.lang')} sub={t(lang, 'set.langSub')}>
        <div className="seg" role="radiogroup" aria-label={t(lang, 'set.lang')}>
          {LANGS.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => set({ lang: l })}>{LANG_LABELS[l]}</button>
          ))}
        </div>
      </SettingRow>
      <SettingRow title={t(lang, 'set.dark')} sub={t(lang, 'set.darkSub')}>
        <Switch label={t(lang, 'set.dark')} checked={state.settings.theme === 'dark'} onChange={(v) => set({ theme: v ? 'dark' : 'light' })} />
      </SettingRow>
      <SettingRow
        title={t(lang, 'set.shortcuts')}
        sub={
          <button type="button" className="link" onClick={() => void browser.tabs.create({ url: SHORTCUTS_URL })}>
            <Keyboard size={12} aria-hidden /> {t(lang, 'set.shortcutsEdit')}
          </button>
        }
      >
        <Switch label={t(lang, 'set.shortcuts')} checked={state.settings.shortcuts} onChange={(v) => set({ shortcuts: v })} />
      </SettingRow>
      <SettingRow title={t(lang, 'set.badge')} sub={t(lang, 'set.badgeSub')}>
        <Switch label={t(lang, 'set.badge')} checked={state.settings.badge} onChange={(v) => set({ badge: v })} />
      </SettingRow>
      <SettingRow title={t(lang, 'set.notify')} sub={t(lang, 'set.notifySub')}>
        <Switch label={t(lang, 'set.notify')} checked={state.settings.notifyErrors} onChange={(v) => set({ notifyErrors: v })} />
      </SettingRow>

      <SettingRow title={t(lang, 'set.diag')} sub={t(lang, 'set.diagSub')}>
        <DiagButton lang={lang} state={state} />
      </SettingRow>

      <section className="border-b border-line px-4 py-3">
        <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-mut">{t(lang, 'set.presets')}</div>
        <div className="flex gap-2">
          {state.presets.map((p) => {
            const Icon = PRESET_ICONS[p.icon];
            return (
              <button key={p.id} type="button" className="icon-btn size-10" aria-label={presetName(state, p)} title={presetName(state, p)} onClick={() => go({ name: 'preset', id: p.id })}>
                <Icon size={16} aria-hidden />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-mut">{t(lang, 'set.presetsSub')}</p>
      </section>

      <SupportCard lang={lang} />

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          className={`btn ${confirmReset ? 'btn-danger' : 'btn-ghost'}`}
          onClick={() => {
            if (!confirmReset) return setConfirmReset(true);
            update(() => makeDefaultState());
            setConfirmReset(false);
          }}
        >
          <RotateCcw size={13} aria-hidden /> {t(lang, confirmReset ? 'set.resetConfirm' : 'set.reset')}
        </button>
        <span className="mono text-[11px] text-mut">v{version}</span>
      </div>
    </main>
  );
}

/** Copies a privacy-safe report (no file names, no absolute paths) for bug reports. */
function DiagButton({ lang, state }: { lang: Lang; state: ViewProps['state'] }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    const report = {
      app: `ToPath Saver ${browser.runtime.getManifest().version}`,
      chrome: /Chrome\/([\d.]+)/.exec(navigator.userAgent)?.[1] ?? '?',
      os: navigator.platform,
      mode: state.mode,
      autoSort: state.autoSort,
      once: state.once,
      folders: state.presets.map((p) => p.folder),
      custom: state.customFolder ? 'set' : '-',
      rootKnown: Boolean(state.downloadsRoot),
      downloads: await readDiag(),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 1));
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button type="button" className="icon-btn size-8 shrink-0" onClick={() => void copy()} aria-label={t(lang, done ? 'set.diagCopied' : 'set.diag')} title={t(lang, 'set.diag')}>
      {done ? <Check size={14} aria-hidden /> : <Activity size={14} aria-hidden />}
    </button>
  );
}

function SupportCard({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ETH_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section className="border-b border-line px-4 py-3" aria-labelledby="support-title">
      <div id="support-title" className="mb-2 text-[11px] uppercase tracking-[.08em] text-mut">{t(lang, 'sup.title')}</div>
      <div className="coffee">
        <div className="flex items-start gap-3">
          <img src={qrUrl} width={76} height={76} alt={t(lang, 'sup.qr')} className="shrink-0 rounded-md bg-white p-1" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[13.5px] font-bold"><Coffee size={14} aria-hidden /> {t(lang, 'sup.coffee')}</div>
            <p className="mt-0.5 text-xs leading-snug text-mut">{t(lang, 'sup.text')}</p>
            <div className="mt-1.5 text-[11px] font-semibold text-eth">{t(lang, 'sup.network')}</div>
          </div>
        </div>
        <code className="mono mt-2.5 block break-all rounded-md border border-line bg-paper px-2 py-1.5 text-[11px]">{ETH_ADDRESS}</code>
        <div className="mt-2 flex gap-2">
          <button type="button" className="btn btn-primary flex-1" onClick={() => void copy()} aria-live="polite">
            <Copy size={13} aria-hidden /> {t(lang, copied ? 'sup.copied' : 'sup.copy')}
          </button>
          <a className="btn btn-ghost flex-1" href={ETH_URI} target="_blank" rel="noreferrer">
            <Wallet size={13} aria-hidden /> {t(lang, 'sup.wallet')}
          </a>
        </div>
        <p className="mt-2 text-[11px] text-mut">{t(lang, 'sup.note')}</p>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5 text-xs">
        <a className="link" href={REPO_URL} target="_blank" rel="noreferrer"><Code size={12} aria-hidden /> {t(lang, 'sup.github')} <ExternalLink size={11} aria-hidden /></a>
        <a className="link" href={CONTACT_URL} target="_blank" rel="noreferrer"><Send size={12} aria-hidden /> {t(lang, 'sup.hire')} <ExternalLink size={11} aria-hidden /></a>
      </div>
    </section>
  );
}
