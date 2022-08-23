export function createResourceUrl(urlParts: string[]): string {
  return '/' + urlParts.join('/');
}
