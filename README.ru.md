# ToPath Saver

**Папка загрузки — в два клика.** Маленькое расширение Chrome: пресеты папок, авторазбор по типу файла и горячие клавиши. Без слежки, без сети, без настройки.

[Релизы](https://github.com/helpfulbriefl/topath-saver/releases) · [История изменений](CHANGELOG.ru.md) · [Приватность](PRIVACY.md) · [English](README.md) · [Сообщить о проблеме](https://github.com/helpfulbriefl/topath-saver/issues) · [☕ Угостить кофе](#-поддержать)

[![Checks](https://github.com/helpfulbriefl/topath-saver/actions/workflows/checks.yml/badge.svg?branch=main)](https://github.com/helpfulbriefl/topath-saver/actions/workflows/checks.yml)
[![Latest release](https://img.shields.io/github/v/release/helpfulbriefl/topath-saver)](https://github.com/helpfulbriefl/topath-saver/releases/latest)
[![License: MIT](https://img.shields.io/github/license/helpfulbriefl/topath-saver)](LICENSE)
[![Buy me a coffee — ETH](https://img.shields.io/badge/Buy%20me%20a%20coffee-ETH-627EEA?style=for-the-badge&logo=ethereum&logoColor=white)](#-поддержать)

Chrome · Edge · Brave (Chromium 116+) · английский, русский, китайский, испанский · светлая и тёмная тема

![Попап ToPath Saver](docs/screenshots/m01-main.png)

## Зачем

| Задача | Что даёт |
| --- | --- |
| Сменить папку | Выберите **Документы**, **Изображения**, **Видео**, **Архивы** или свою папку — все следующие загрузки пойдут туда. Без «Сохранить как…». |
| Разложить само | **Авторазбор по типу файла**: pdf → Документы, jpg → Изображения, mp4 → Видео, zip → Архивы. Неизвестное — в папку Chrome по умолчанию. |
| Вложения Gmail | **Скачать все из Gmail** — все вложения открытого письма в выбранную папку отдельными файлами (без ZIP и окон). С авторазбором — по типу. |
| Разовая загрузка | **Только для следующей загрузки** — один файл (или пачка из Gmail) в нужную папку, потом возврат к прежней. |
| Своя структура | Своя папка вроде `Work/Q4` с проверкой на лету и кнопкой **Исправить автоматически**. Пресеты редактируются: имя, папка, иконка. |
| Внешний вид | Четыре стиля иконок в настройках: линии, двухтонные, Windows 11 и 3D. |
| Скорость | **Alt+Shift+1…4** и значок на панели (`DOC`, `IMG`, `VID`, `ZIP`, `DIR`, `AUTO`) — всегда видно, куда пойдёт файл. |
| Надёжность | При ошибке — уведомление с **Повторить** и **Открыть папку**. Файл не теряется: Chrome оставит его в «Загрузках». |

## Установка

1. Скачайте **topath-saver-*-chrome.zip** из [последнего релиза](https://github.com/helpfulbriefl/topath-saver/releases/latest) и распакуйте в постоянную папку (сверить можно по **SHA256SUMS.txt**).
2. Откройте `chrome://extensions`, включите **Режим разработчика**, нажмите **Загрузить распакованное** и выберите папку.
3. Закрепите значок, нажмите и выберите папку. Готово.

Публикация в Chrome Web Store — скоро.

**Ограничение.** Chrome разрешает расширениям сохранять только **внутри папки «Загрузки»** (подпапки — да, другие диски — нет).

## Горячие клавиши

| Действие | Клавиши |
| --- | --- |
| По умолчанию Chrome | Alt+Shift+1 |
| Документы | Alt+Shift+2 |
| Изображения | Alt+Shift+3 |
| Видео | Alt+Shift+4 |
| Архивы / Своя папка | назначьте в `chrome://extensions/shortcuts` |

Отключаются в **Настройки → Горячие клавиши**.

## Приватность

Никакой аналитики и **никаких запросов на наши серверы**. Настройки хранятся в `chrome.storage.local` на вашем устройстве. Доступ к странице (`activeTab` + `scripting`) — только когда вы открываете расширение на вкладке Gmail, чтобы найти ссылки на вложения письма. Подробно: [PRIVACY.md](PRIVACY.md).

## Сборка и тесты

Нужен **Node.js 22+**: `npm ci` · `npx playwright install chromium` · `npm run gates` (tsc · vitest · сборка · Playwright-стенд с реальными загрузками).

## Статус и сотрудничество

Независимый проект одного разработчика. Баги, переводы и идеи — в [issues](https://github.com/helpfulbriefl/topath-saver/issues).

**Открыт к работе:** расширения браузера, десктопные утилиты, веб-приложения — как независимый разработчик, фриланс или part-time в команде. Пишите в [@yumi_acess](https://t.me/yumi_acess) или смотрите [портфолио](https://helpfulbriefl.github.io/).

## ☕ Поддержать

<img src="docs/eth-qr.svg" alt="QR-код ETH-адреса" width="160" align="right">

**Ethereum (ERC-20)** — ETH или токены в сети Ethereum:

```text
0x50153B5CC3eae905291d62602226C80896Aa64f2
```

Проверьте адрес и сеть перед отправкой. Та же карточка с QR и кнопкой копирования — в расширении: **Настройки → Поддержать**.

<br clear="right">

## Лицензия

[MIT](LICENSE) © 2026 helpfulbriefl. Иконки: [Lucide](https://lucide.dev) (ISC), [Phosphor](https://phosphoricons.com) (MIT), [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) и [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT, © Microsoft). Логотип «G» — товарный знак Google LLC.
