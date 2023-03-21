const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const newUrl = (url: string, params: object = {}) => {
  let base;
  if (url.startsWith("/")) {
    url = BASE_PATH + url;
    base = globalThis.location.href;
  }
  const ret = new URL(url, base);
  for (const [k, v] of Object.entries(params)) {
    ret.searchParams.set(k, v);
  }
  return ret;
};
