import React, { useState, useEffect } from 'react';
import AdminPanel from './screens/AdminPanel';
import Monitor from './screens/Monitor';
import { ZeusDefs } from './components/common/ZeusSvg';

export default function App() {
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'monitor' || window.location.hash === '#/monitor') {
        return 'monitor';
      }
      if (viewParam === 'admin' || window.location.hash === '#/admin') {
        return 'admin';
      }
    }
    return 'admin';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  const handleChangeView = (view) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const viewMode = currentView === 'admin' ? 'admin' : 'tv';

  return (
    <div
      data-view-mode={viewMode}
      className="w-full h-full min-h-screen bg-[#F4F2EB] text-[#0F1E36] relative"
    >
      {/* Definiciones Vectoriales del Olimpo y Rayo de Zeus */}
      <ZeusDefs />

      {/* Pantalla Activa Polimórfica */}
      {currentView === 'admin' ? (
        <AdminPanel currentView={currentView} onChangeView={handleChangeView} />
      ) : (
        <Monitor currentView={currentView} onChangeView={handleChangeView} />
      )}
    </div>
  );
}
