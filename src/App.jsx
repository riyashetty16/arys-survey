import { lazy, Suspense, useEffect, useState } from 'react';
import Survey from './Survey.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  if (hash === '#/admin') {
    return (
      <Suspense fallback={<main className="screen" />}>
        <Admin />
      </Suspense>
    );
  }
  return <Survey />;
}
