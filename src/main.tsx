import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App.tsx';
import './global.css';

// ── Global prefers-reduced-motion detection ──────────────────────────────────
// Sets data-reduced-motion attribute on <html> so CSS and Motion components
// can respond without each component independently querying the media query.
function applyReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.setAttribute(
    'data-reduced-motion',
    mq.matches ? 'true' : 'false'
  );
}
applyReducedMotion();
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', applyReducedMotion);

// ── Persist theme class on hot reload ────────────────────────────────────────
const savedTheme = localStorage.getItem('krishi_theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      MotionConfig reducedMotion="user" makes every `motion/react` component in the
      app automatically respect the OS-level prefers-reduced-motion setting — it
      swaps transform/scale/translate animations for opacity-only crossfades
      without requiring each component to check the media query itself. This is
      the single global mechanism; the data-reduced-motion attribute below (kept
      for the CSS `@media (prefers-reduced-motion: reduce)` rules in global.css)
      handles plain CSS transitions/animations, so together the two cover both
      JS-driven (Motion) and CSS-driven animation.
    */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
);
