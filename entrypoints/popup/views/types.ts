import type { State } from '../../../lib/types';
import type { View } from '../App';

export interface ViewProps {
  state: State;
  update: (fn: (s: State) => State) => void;
  go: (v: View) => void;
}
