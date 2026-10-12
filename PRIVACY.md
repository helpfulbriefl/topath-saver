# Privacy policy — ToPath Saver

_Last updated: 2026-10-13_

ToPath Saver does **not** collect, sell or transmit any personal data.

- **No network requests.** The extension never contacts any server. No analytics, no telemetry, no ads, no remote code.
- **What is stored, and where.** Your settings (selected folder mode, presets, custom folder, language, theme, the name of the last routed file) are stored locally with `chrome.storage.local` on your device. They never leave your browser and are removed when you uninstall the extension.
- **Diagnostics.** The extension keeps a local log of the last 20 downloads: mode, file extension, target folder and the folder relative to Downloads — no file names, no full paths, no URLs. It is copied to your clipboard only when you click **Settings → Copy diagnostics**.
- **Permissions.**
  - `downloads` — to choose the subfolder for a new download (`onDeterminingFilename`), create the chosen folder in advance (an empty marker file that is deleted at once) and show/open the saved file.
  - `storage` — to remember your settings.
  - `notifications` — to tell you when a download fails (can be turned off).
- **Links you click.** The Settings screen contains links to GitHub, Telegram and the developer portfolio, and an `ethereum:` wallet link. They open only when you click them.

Questions: [@yumi_acess](https://t.me/yumi_acess) · [issues](https://github.com/helpfulbriefl/topath-saver/issues)
