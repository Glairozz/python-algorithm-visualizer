import { useEffect, useRef, useState } from 'react';
import { algorithms } from '../algorithms';
import { landingUrl, visualizerUrl, type Route } from '../router';

type Navigate = (to: Route, hash?: string, url?: string) => void;

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------- Navbar ---------------------------------- */

function NavBar({ onNavigate }: { onNavigate: Navigate }) {
  const [open, setOpen] = useState(false);
  const go = (hash: string) => {
    setOpen(false);
    onNavigate('landing', hash);
  };
  return (
    <header className="ln-nav">
      <div className="ln-nav-inner">
        <a
          className="ln-brand"
          href={landingUrl()}
          onClick={(e) => {
            e.preventDefault();
            go('top');
          }}
        >
          <span className="ln-brand-mark" aria-hidden="true">
            <span style={{ height: '45%' }} />
            <span style={{ height: '100%' }} />
            <span style={{ height: '70%' }} />
          </span>
          <span className="ln-brand-text">
            Python Algorithm <em>Visualizer</em>
          </span>
        </a>
        <button
          className="ln-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`ln-links${open ? ' open' : ''}`} aria-label="Primary">
          <a href="#top" onClick={(e) => { e.preventDefault(); go('top'); }}>Home</a>
          <a href="#algorithms" onClick={(e) => { e.preventDefault(); go('algorithms'); }}>Algorithms</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); go('features'); }}>Features</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); go('how'); }}>How It Works</a>
          <a
            className="ln-cta"
            href={visualizerUrl()}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              onNavigate('visualizer');
            }}
          >
            Start Visualizing
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------ Hero preview ------------------------------ */

const BAR_COUNT = 14;

function HeroVisual() {
  const [bars, setBars] = useState<number[]>(() => {
    const seed = [42, 68, 25, 80, 55, 34, 90, 61, 47, 72, 30, 85, 51, 66];
    return seed.slice(0, BAR_COUNT);
  });
  const [pair, setPair] = useState<number[]>([]);
  const [status, setStatus] = useState('Comparing elements…');
  const [step, setStep] = useState(1);
  const stateRef = useRef({ i: 0, j: 0, arr: [42, 68, 25, 80, 55, 34, 90, 61, 47, 72, 30, 85, 51, 66], step: 1 });

  useEffect(() => {
    if (REDUCED()) {
      setStatus('Static preview (reduced motion)');
      return;
    }
    const id = window.setInterval(() => {
      const s = stateRef.current;
      const arr = [...s.arr];
      if (s.j >= BAR_COUNT - s.i - 1) {
        s.i += 1;
        s.j = 0;
        if (s.i >= BAR_COUNT - 1) {
          s.i = 0;
          s.j = 0;
          for (let k = arr.length - 1; k > 0; k--) {
            const r = Math.floor(Math.random() * (k + 1));
            [arr[k], arr[r]] = [arr[r], arr[k]];
          }
          setStatus('Generated new array…');
        } else {
          setStatus('Pass complete — next pass…');
        }
      }
      setPair([s.j, s.j + 1]);
      if (arr[s.j] > arr[s.j + 1]) {
        [arr[s.j], arr[s.j + 1]] = [arr[s.j + 1], arr[s.j]];
        setStatus(`Swap ${arr[s.j + 1]} ←→ ${arr[s.j]}`);
      } else {
        setStatus(`Comparing elements…`);
      }
      s.j += 1;
      s.step += 1;
      s.arr = arr;
      setBars(arr);
      setStep(s.step);
    }, 420);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure className="ln-hero-card" aria-label="Animated preview of a sorting algorithm">
      <figcaption className="ln-hero-card-head">
        <span className="ln-dot" />
        <span>Algorithm: Bubble Sort</span>
        <span className="ln-hero-badge">python</span>
      </figcaption>
      <div className="ln-bars" role="presentation">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`ln-bar${pair.includes(i) ? ' active' : ''}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="ln-hero-status">
        <span className="ln-mono">&gt;&gt;&gt; {status}</span>
        <span className="ln-mono dim">Step {step}</span>
      </div>
    </figure>
  );
}

/* ---------------------------------- Sections ---------------------------------- */

const featureList = [
  { title: 'Interactive Visualizations', body: 'Watch algorithms execute step-by-step instead of reading static explanations.' },
  { title: 'Python Powered', body: 'Explore algorithm implementations using Python concepts and syntax.' },
  { title: 'Step-by-Step', body: 'Control the visualization and understand every operation.' },
  { title: 'Complexity', body: 'Understand time and space complexity alongside the visualization.' },
  { title: 'Multiple Algorithms', body: 'Explore sorting, searching, graphs and data structures.' },
  { title: 'Beginner Friendly', body: 'Designed to make complex algorithmic concepts easier to understand.' },
];

const categoryOrder: { category: string; blurb: string }[] = [
  { category: 'Sorting', blurb: 'Watch elements find their rightful place.' },
  { category: 'Searching', blurb: 'See how values are located in data.' },
];

const complexityExamples = [
  { name: 'Bubble Sort', big: 'O(n²)', note: 'Comparing neighbors, one pass at a time.' },
  { name: 'Merge Sort', big: 'O(n log n)', note: 'Divide, conquer, and merge back sorted.' },
  { name: 'Binary Search', big: 'O(log n)', note: 'Halve the search space on every step.' },
];

/* ---------------------------------- Landing ---------------------------------- */

export function Landing({ onNavigate }: { onNavigate: Navigate }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#0a0a0b';
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <div className="landing" id="top">
      <NavBar onNavigate={onNavigate} />

      <section className="ln-hero">
        <div className="ln-hero-grid">
          <div className="ln-hero-copy">
            <p className="ln-kicker">
              <span className="ln-mono">$</span> python -m algorithm_visualizer
            </p>
            <h1>
              See Algorithms
              <br />
              Come to Life.
            </h1>
            <p className="ln-lede">
              Explore sorting, searching, graph and data structure algorithms
              through interactive Python-powered visualizations.
            </p>
            <div className="ln-hero-actions">
              <a
                className="ln-btn primary"
                href={visualizerUrl()}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('visualizer');
                }}
              >
                Start Visualizing
              </a>
              <a
                className="ln-btn ghost"
                href="#algorithms"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('landing', 'algorithms');
                }}
              >
                Explore Algorithms
              </a>
            </div>
            <p className="ln-mono ln-hero-snippet" aria-hidden="true">
              def quick_sort(array):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;O(n log n) avg → visualized step by step
            </p>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="ln-section" id="features">
        <h2>Learn by Watching.</h2>
        <p className="ln-section-lede">
          Every operation is explained in plain language while you watch it happen.
        </p>
        <div className="ln-cards">
          {featureList.map((f) => (
            <article className="ln-card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ln-section" id="algorithms">
        <h2>Explore Algorithms.</h2>
        <p className="ln-section-lede">
          The algorithms below are live in the visualizer right now.
        </p>
        <div className="ln-algo-grid">
          {categoryOrder.map(({ category, blurb }) => (
            <article className="ln-algo-card" key={category}>
              <p className="ln-tag">{category.toUpperCase()}</p>
              <p className="ln-algo-blurb">{blurb}</p>
              <ul>
                {algorithms
                  .filter((a) => a.category === category)
                  .map((a) => (
                    <li key={a.id}>
                      <a
                        href={visualizerUrl(a.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('visualizer', undefined, visualizerUrl(a.id));
                        }}
                      >
                        {a.name}
                      </a>
                    </li>
                  ))}
              </ul>
              <a
                className="ln-explore"
                href={visualizerUrl()}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('visualizer');
                }}
              >
                Explore →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="ln-section" id="how">
        <h2>How It Works.</h2>
        <div className="ln-steps">
          {[
            { n: '01', t: 'Choose', b: 'Select an algorithm.' },
            { n: '02', t: 'Visualize', b: 'Watch every operation happen.' },
            { n: '03', t: 'Understand', b: 'Connect the visualization with the underlying Python implementation.' },
          ].map((s, i) => (
            <div className="ln-step" key={s.n}>
              <span className="ln-mono ln-step-n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.b}</p>
              {i < 2 && <span className="ln-step-arrow" aria-hidden="true">↓</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="ln-section" id="complexity">
        <h2>From Code to Complexity.</h2>
        <div className="ln-complexity">
          {complexityExamples.map((c) => (
            <div className="ln-cx-card" key={c.name}>
              <h3>{c.name}</h3>
              <p className="ln-mono ln-big-o">{c.big}</p>
              <div className="ln-cx-bar" aria-hidden="true">
                <span style={{ width: c.big === 'O(n²)' ? '85%' : c.big === 'O(n log n)' ? '50%' : '22%' }} />
              </div>
              <p>{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ln-section ln-edu">
        <h2>Stop Memorizing.<br />Start Understanding.</h2>
        <p className="ln-section-lede">
          Algorithms become easier to understand when you can see exactly what
          the computer is doing.
        </p>
        <div className="ln-edu-grid">
          <div className="ln-edu-card">
            <h3>Traditional Learning</h3>
            <ol>
              <li>Read</li>
              <li>Memorize</li>
              <li>Forget</li>
            </ol>
          </div>
          <div className="ln-edu-card accent">
            <h3>Visual Learning</h3>
            <ol>
              <li>See</li>
              <li>Understand</li>
              <li>Remember</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="ln-cta-final">
        <h2>Ready to Visualize an Algorithm?</h2>
        <p>Choose an algorithm and see how it works, one step at a time.</p>
        <a
          className="ln-btn primary"
          href={visualizerUrl()}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('visualizer');
          }}
        >
          Start Visualizing
        </a>
      </section>

      <footer className="ln-footer">
        <div className="ln-footer-grid">
          <div>
            <p className="ln-brand-text">
              Python Algorithm <em>Visualizer</em>
            </p>
            <p className="ln-footer-note">
              Built for learning algorithms through visualization.
            </p>
          </div>
          <nav aria-label="Footer">
            <a href="#top" onClick={(e) => { e.preventDefault(); onNavigate('landing', 'top'); }}>Home</a>
            <a href="#algorithms" onClick={(e) => { e.preventDefault(); onNavigate('landing', 'algorithms'); }}>Algorithms</a>
            <a href={visualizerUrl()} onClick={(e) => { e.preventDefault(); onNavigate('visualizer'); }}>Visualizer</a>
            <a href="https://github.com/Glairozz/python-algorithm-visualizer" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
