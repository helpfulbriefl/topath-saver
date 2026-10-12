# Changelog

All notable changes are listed here. Format: [Keep a Changelog](https://keepachangelog.com), versions: [SemVer](https://semver.org). [Русский](CHANGELOG.ru.md)

## [0.2.0] — 2026-10-13

### Added
- **Download all from Gmail**: one button saves every attachment of the open email (each as a separate file, no ZIP) into the chosen folder — or by file type when *Auto-sort* is on. No "Save as" dialog per file.
- **Icon styles** in Settings: thin lines (Lucide), duotone (Phosphor), Windows 11 (Fluent, default) and 3D (Fluent Emoji); each folder type has its own colour.
- *Only for the next download* now returns to the folder you had **before** (not always to Chrome default); a whole Gmail batch counts as one "next download".

### Fixed
- Picking a folder never starts a download by itself.

### Fixed
- A file that Chrome saved somewhere else is no longer reported as success: the folder is compared exactly with `Downloads/<folder>`, and the notification explains the usual reasons.
- Two downloads started at the same moment (e.g. Gmail attachments) can no longer lose their routing record.

### Added
- **Settings → Copy diagnostics**: the last 20 downloads (mode, file type, target and actual folder; no file names, no full paths) for bug reports.
- The status line now shows the folder first: "In Documents/: file.docx".

## [0.1.0] — 2026-10-12

### Added
- Popup with six modes: **Chrome default**, **Documents**, **Images**, **Video**, **Archives**, **Custom** — switch the download folder in two clicks.
- Folders inside Downloads are created automatically on the first download.
- **Auto-sort by file type** (pdf → Documents, jpg → Images, mp4 → Video, zip → Archives, unknown → Chrome default).
- **Only for the next download** — one-shot mode that returns to Chrome default.
- Custom folder with live validation, "Fix automatically" and recent folders.
- Editable presets (name, folder, icon).
- Keyboard shortcuts Alt+Shift+1…4 (can be turned off), toolbar badge (DOC, IMG, VID, ZIP, DIR, AUTO).
- Error notifications with Retry / Open folder; the file is never lost — Chrome keeps it in Downloads.
- English, Russian, Simplified Chinese and Spanish; light theme with a dark toggle.
- Support card (ETH) and links in Settings.
