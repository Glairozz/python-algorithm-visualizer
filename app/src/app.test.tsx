import { describe, expect, it, beforeEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

describe('App smoke test', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  it('renders the shell with sidebar, canvas and controls', async () => {
    await act(async () => {
      root.render(<App />);
    });
    expect(container.querySelector('.site-header')).toBeTruthy();
    expect(container.querySelector('.sidebar')).toBeTruthy();
    expect(container.querySelector('.canvas')).toBeTruthy();
    expect(container.querySelector('.control-bar')).toBeTruthy();
    expect(container.querySelector('.pseudocode')).toBeTruthy();
    expect(container.querySelector('.complexity-table')).toBeTruthy();
    // Bars are rendered
    expect(container.querySelectorAll('.bar').length).toBeGreaterThan(0);
  });

  it('steps forward when the next button is clicked', async () => {
    await act(async () => {
      root.render(<App />);
    });
    const buttons = Array.from(container.querySelectorAll('button'));
    const next = buttons.find((b) => b.textContent?.includes('Next'))!;
    await act(async () => {
      next.click();
    });
    const text = container.querySelector('.status-bar')!.textContent!;
    expect(text).toContain('step');
    expect(container.querySelector('.op-chip')).toBeTruthy();
  });
});
