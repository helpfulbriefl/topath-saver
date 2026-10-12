import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

const cmd = (n: number, key?: string) => ({
  ...(key ? { suggested_key: { default: key } } : {}),
  description: `__MSG_cmdMode${n}__`,
});

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({ plugins: [tailwindcss()] }),
  manifest: {
    name: '__MSG_extName__',
    short_name: 'ToPath',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    minimum_chrome_version: '116',
    permissions: ['downloads', 'storage', 'notifications', 'activeTab', 'scripting'],
    action: { default_title: 'ToPath Saver' },
    options_ui: { page: 'popup.html?view=settings', open_in_tab: false },
    commands: {
      'mode-1': cmd(1, 'Alt+Shift+1'),
      'mode-2': cmd(2, 'Alt+Shift+2'),
      'mode-3': cmd(3, 'Alt+Shift+3'),
      'mode-4': cmd(4, 'Alt+Shift+4'),
      'mode-5': cmd(5),
      'mode-6': cmd(6),
    },
  },
});
