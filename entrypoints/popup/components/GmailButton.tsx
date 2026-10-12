import { AlertTriangle, Check as CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { isGmailUrl, scanGmail, type GFile } from '../../../lib/gmail';
import { t } from '../../../lib/i18n';
import { jobActive, readJob, type Job } from '../../../lib/storage';
import type { State } from '../../../lib/types';

export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

type Scan = { kind: 'loading' | 'nogmail' | 'none' | 'ready'; files: GFile[] };

function useScan(): Scan {
  const [scan, setScan] = useState<Scan>({ kind: 'loading', files: [] });
  useEffect(() => {
    void (async () => {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id || !isGmailUrl(tab.url)) return setScan({ kind: 'nogmail', files: [] });
        const [res] = await browser.scripting.executeScript({ target: { tabId: tab.id }, func: scanGmail });
        const files = (res?.result as GFile[] | undefined) ?? [];
        setScan({ kind: files.length ? 'ready' : 'none', files });
      } catch {
        setScan({ kind: 'nogmail', files: [] });
      }
    })();
  }, []);
  return scan;
}

function useJob(): Job | null {
  const [job, setJob] = useState<Job | null>(null);
  useEffect(() => {
    void readJob().then(setJob);
    const cb = (ch: Record<string, { newValue?: unknown }>, area: string) => {
      if (area === 'local' && ch.job) setJob((ch.job.newValue as Job | undefined) ?? null);
    };
    browser.storage.onChanged.addListener(cb);
    return () => browser.storage.onChanged.removeListener(cb);
  }, []);
  return job;
}

export function GmailButton({ state }: { state: State }) {
  const lang = state.settings.lang;
  const scan = useScan();
  const job = useJob();
  const busy = jobActive(job);
  const off = !busy && scan.kind !== 'ready';
  const where = (label: string | null) => (label === '*' ? t(lang, 'gmail.byType') : label ?? t(lang, 'gmail.toDefault'));
  const label = state.autoSort ? '*'
    : state.mode === 'default' ? null
    : state.mode === 'custom' ? state.customFolder
    : state.presets.find((p) => p.id === state.mode)?.folder ?? null;
  const sub = busy ? `→ ${where(job.label)}`
    : `→ ${label && label !== '*' ? `Downloads/${label}` : where(label)}${state.once && !state.autoSort && state.mode !== 'default' ? ` · ${t(lang, 'gmail.once')}` : ''}`;
  const recent = job && !job.running && Date.now() - job.at < 10 * 60_000 ? job : null;

  return (
    <div className="px-3 pb-2.5">
      <div className={`gmail ${off ? 'gmail-off' : ''} ${busy ? 'gmail-busy' : ''}`}>
        <span className="gmail-glow" aria-hidden />
        <button
          type="button"
          className="gmail-ring"
          disabled={off || busy}
          aria-busy={busy}
          onClick={() => void browser.runtime.sendMessage({ type: 'gmail-all', files: scan.files })}
        >
          <span className="gmail-inner">
            <span className="gmail-g"><GoogleG /></span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13.5px] font-semibold">
                {busy ? t(lang, 'gmail.busy', { done: job.done + job.failed + 1 > job.total ? job.total : job.done + job.failed + 1, total: job.total }) : t(lang, 'gmail.all')}
              </span>
              {!off ? <span className="mono block truncate text-[10.5px] opacity-70">{sub}</span> : null}
            </span>
            {!off && !busy ? <span className="gmail-count">{scan.files.length}</span> : null}
            {busy ? <span className="gmail-bar" style={{ width: `${Math.round(((job.done + job.failed) / job.total) * 100)}%` }} /> : null}
          </span>
        </button>
      </div>
      {off && scan.kind !== 'loading' ? (
        <p className="mt-1.5 text-center text-[11.5px] text-warn">{t(lang, scan.kind === 'none' ? 'gmail.none' : 'gmail.open')}</p>
      ) : null}
      {recent && !busy ? (
        <p className={`mt-1.5 flex items-center justify-center gap-1.5 text-[11.5px] ${recent.failed ? 'text-warn' : 'text-ok'}`} role="status">
          {recent.failed ? <AlertTriangle size={12} aria-hidden /> : <CheckIcon size={12} aria-hidden />}
          <span className="truncate">
            {t(lang, 'gmail.done', { n: recent.done, folder: where(recent.label) })}
            {recent.failed ? ` · ${t(lang, 'gmail.failed', { failed: recent.failed, total: recent.total })}` : ''}
          </span>
        </p>
      ) : null}
    </div>
  );
}
