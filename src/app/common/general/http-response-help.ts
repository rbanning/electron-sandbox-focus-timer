export type ContentType = 'json' | 'text' | 'image' | 'other';
function getContentType(resp: Response): ContentType | undefined {
  const header = resp.headers.get('Content-Type');
  if (header) {
    const value = header.split(';')[0]; //ignore charset if included
    if (value.includes('json')) { return 'json'; }
    if (value.includes('text')) { return 'text'; }
    if (value.includes('image')) { return 'image'}
    //else
    return 'other';
  }
  //else
  return undefined;
}


export const httpResponseHelper = {
  getContentType
} as const;