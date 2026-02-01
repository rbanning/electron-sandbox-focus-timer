export function replaceAll(text: string, find: string, replace: string) {
  return text.replace(new RegExp(find, 'g'), replace);
}