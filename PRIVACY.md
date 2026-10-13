# Privacy policy — ToPath Saver

_Last updated: 2026-10-13_

ToPath Saver does **not** collect, sell or transmit any personal data.

- **No developer-server requests.** The extension has no analytics, telemetry, ads or remote code and does not send data to developer servers. When you click Download all from Gmail, Chrome downloads the selected visible attachments from Google using your existing browser session.
- **What is stored, and where.** Your settings (selected folder mode, presets, custom folder, language, theme, the name of the last routed file) are stored locally with `chrome.storage.local` on your device. They never leave your browser and are removed when you uninstall the extension.
- **Diagnostics.** The extension keeps a local log of the last 20 downloads: mode, file extension, target folder and the folder relative to Downloads — no file names, no full paths, no URLs. It is copied to your clipboard only when you click **Settings → Copy diagnostics**.
- **Permissions.**
  - `downloads` — to choose the subfolder for a new download (`onDeterminingFilename`) and show/open the saved file.
  - `activeTab` + `scripting` — only when you open the popup on a Gmail tab: reads the links of attachments visible in the open email, to show the count and download them on your click. Email text is not read. Attachment links are used transiently to start the requested downloads; they are not sent to developer servers.
  - `storage` — to remember your settings.
  - `notifications` — to tell you when a download fails (can be turned off).
- **Links you click.** The Settings screen contains links to GitHub, Telegram and the developer portfolio, and an `ethereum:` wallet link. They open only when you click them.

Questions: [@yumi_acess](https://t.me/yumi_acess) · [issues](https://github.com/helpfulbriefl/topath-saver/issues)
