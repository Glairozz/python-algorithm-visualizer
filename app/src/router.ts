/** Lightweight client-side routing between landing and visualizer. */

export type Route = 'landing' | 'visualizer';

export function basePath(): string {
  return import.meta.env.BASE_URL; // always ends with '/'
}

export function currentRoute(): Route {
  const base = basePath();
  let rest = window.location.pathname;
  if (rest.startsWith(base)) rest = rest.slice(base.length);
  rest = rest.replace(/^\/+|\/+$/g, '');
  return rest.split('/')[0] === 'visualizer' ? 'visualizer' : 'landing';
}

export function visualizerUrl(algoId?: string): string {
  const url = `${basePath()}visualizer${algoId ? `?algo=${encodeURIComponent(algoId)}` : ''}`;
  return url;
}

export function landingUrl(hash?: string): string {
  return `${basePath()}${hash ? `#${hash}` : ''}`;
}
