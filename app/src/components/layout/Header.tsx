export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="./" aria-label="Algorithm Visualizer home">
        <span className="brand-mark" aria-hidden="true">
          <span style={{ height: '40%' }} />
          <span style={{ height: '100%' }} />
          <span style={{ height: '70%' }} />
        </span>
        <span className="brand-name">Algorithm Visualizer</span>
        <span className="brand-sub">learn algorithms interactively</span>
      </a>
      <nav className="header-links" aria-label="Project links">
        <a href="https://glairozz.github.io/python-algorithm-visualizer/" className="hide-sm">
          Docs
        </a>
        <a href="https://github.com/Glairozz/python-algorithm-visualizer" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
