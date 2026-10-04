import React, { Suspense, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { currentRoute, basePath, type Route } from './router';
import { Landing } from './landing/Landing';
import './styles/globals.css';
import './styles/landing.css';

// Lazy-load the visualizer so the landing page never initializes app logic.
const LazyApp = React.lazy(() =>
  import('./App').then((m) => ({ default: m.App })),
);

function Root() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const onPop = () => {
      setRoute(currentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: Route, hash?: string, url?: string) => {
    setPhase('out');
    window.setTimeout(() => {
      const path =
        url ??
        (to === 'visualizer' ? `${basePath()}visualizer` : basePath());
      window.history.pushState(null, '', hash ? `${path}#${hash}` : path);
      setRoute(to);
      setPhase('in');
      window.scrollTo(0, 0);
      if (hash) {
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
    }, 180);
  }, []);

  return (
    <div className={`page-transition page-${phase}`}>
      {route === 'visualizer' ? (
        <Suspense
          fallback={
            <div className="viz-loading" role="status">
              Loading visualizer…
            </div>
          }
        >
          <LazyApp />
        </Suspense>
      ) : (
        <Landing onNavigate={navigate} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
