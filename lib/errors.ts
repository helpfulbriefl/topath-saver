/** Map chrome.downloads InterruptReason to an i18n key. */
export function downloadErrorKey(code: string): string {
  if (code === 'FILE_NO_SPACE') return 'dlerr.space';
  if (code === 'FILE_ACCESS_DENIED') return 'dlerr.access';
  if (code === 'FILE_NAME_TOO_LONG') return 'dlerr.name';
  if (code === 'FILE_VIRUS_INFECTED' || code === 'FILE_BLOCKED' || code === 'FILE_SECURITY_CHECK_FAILED') return 'dlerr.blocked';
  if (code.startsWith('NETWORK_')) return 'dlerr.network';
  if (code.startsWith('SERVER_')) return 'dlerr.server';
  return 'dlerr.other';
}
