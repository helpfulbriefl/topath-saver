import { useEffect, useState } from 'react';
import type { PresetId } from '../../lib/types';
import { useAppState } from './useAppState';
import { CustomView } from './views/CustomView';
import { MainView } from './views/MainView';
import { PresetView } from './views/PresetView';
import { SettingsView } from './views/SettingsView';

export type View = { name: 'main' } | { name: 'custom' } | { name: 'settings' } | { name: 'preset'; id: PresetId };

export default function App() {
  const { state, update } = useAppState();
  const [view, setView] = useState<View>(() =>
    new URLSearchParams(location.search).get('view') === 'settings' ? { name: 'settings' } : { name: 'main' },
  );

  useEffect(() => {
    if (!state) return;
    document.documentElement.classList.toggle('dark', state.settings.theme === 'dark');
    document.documentElement.lang = state.settings.lang === 'zh' ? 'zh-CN' : state.settings.lang;
  }, [state?.settings.theme, state?.settings.lang]);

  if (!state) return <div className="h-[420px]" aria-busy="true" />;
  const props = { state, update, go: setView };
  return (
    <div key={view.name} className="view-enter">
      {view.name === 'main' && <MainView {...props} />}
      {view.name === 'custom' && <CustomView {...props} />}
      {view.name === 'settings' && <SettingsView {...props} />}
      {view.name === 'preset' && <PresetView {...props} id={view.id} />}
    </div>
  );
}
