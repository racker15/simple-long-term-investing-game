import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
const View =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).has('scenario')
    ? lazy(() => import('./components/HistoricalPreview'))
    : lazy(() => import('./App'));
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Loading scenario…</p>}>
      <View />
    </Suspense>
  </StrictMode>,
);
