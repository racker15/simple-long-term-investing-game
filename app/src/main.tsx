import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';
const View =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('scenario') === '1999-09'
    ? lazy(() => import('./components/HistoricalPreview'))
    : App;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Loading scenario…</p>}>
      <View />
    </Suspense>
  </StrictMode>,
);
