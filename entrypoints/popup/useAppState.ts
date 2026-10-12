import { useCallback, useEffect, useState } from 'react';
import { loadState, onStateChange, updateState } from '../../lib/storage';
import type { State } from '../../lib/types';

export function useAppState() {
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    let alive = true;
    void loadState().then((s) => alive && setState(s));
    const off = onStateChange((s) => alive && setState(s));
    return () => { alive = false; off(); };
  }, []);
  const update = useCallback((fn: (s: State) => State) => {
    setState((cur) => (cur ? fn(cur) : cur)); // optimistic, storage event confirms
    void updateState(fn).then(setState);
  }, []);
  return { state, update };
}
