# Chrome Web Store privacy practices — ToPath Saver

## Single purpose
ToPath Saver organizes new Chrome downloads into user-selected subfolders inside Downloads, including user-initiated Gmail attachment downloads.

## Built manifest reviewed
Version `0.2.0`; permissions: `downloads`, `storage`, `notifications`, `activeTab`, `scripting`.

There are no `host_permissions`. Remote code: **No**.

## Permission use

| Permission | Purpose and data handling |
|---|---|
| `downloads` | Routes new downloads to the folder chosen by the user; starts requested Gmail attachment downloads; opens requested downloaded files. Chrome handles the download transfer. Local download filename and history metadata are accessed only to route, report status, and display the last result. |
| `storage` | Keeps local preferences, selected mode, job state, and local diagnostics on the device. |
| `notifications` | Shows local failure or download-routing conflict alerts; the user can turn notifications off. |
| `activeTab` | Gives temporary access to the current Gmail tab only after the user invokes the extension there. |
| `scripting` | Discovers links for attachments visible in that open Gmail message. Email text is not read. Attachment links are used transiently to begin downloads requested by the user. |

## Data use and transmission
The extension does not collect, sell, transmit, or send data to the developer. It has no analytics, telemetry, advertising, or remote code. Settings, job state, and diagnostics remain locally on the device. When the user clicks Download all from Gmail, Chrome downloads the selected visible attachments from Google using the user's existing browser session; attachment links are not sent to developer servers.

## Certifications for Owner review
Before submitting in the Chrome Web Store dashboard, the Owner must read and personally confirm every certification and data-use answer presented by Google. No certification is prechecked here because this document does not act on a remote account.

Public policy URL: https://github.com/helpfulbriefl/topath-saver/blob/main/PRIVACY.md
