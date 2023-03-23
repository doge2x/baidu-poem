export const newUrl = (url: string, params: object = {}): URL => {
  let base;
  if (url.startsWith("/")) {
    base = self.location.href;
  }
  const ret = new URL(url, base);
  for (const [k, v] of Object.entries(params)) {
    ret.searchParams.set(k, v);
  }
  return ret;
};
