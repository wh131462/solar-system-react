import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import TimelineControls from './components/TimelineControls';
import LabPanel from './components/LabPanel';
import ObservePanel from './components/ObservePanel';
import SolarSystem3D from './components/SolarSystem3D';
import KnowledgeView from './components/KnowledgeView';
import AchievementModal from './components/AchievementModal';
import Loading from './components/Loading';
import Toast from './components/Toast';
import './styles/global.css';

function AppContent() {
  const { dispatch, sceneRef } = useApp();
  const [achOpen, setAchOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        dispatch({ type: 'TOGGLE_PAUSE' });
        e.preventDefault();
      }
      if (e.key >= '0' && e.key <= '9') {
        const idx = e.key === '0' ? 0 : +e.key - 1;
        if (idx < 9 && sceneRef.current?.focusOnPlanet) {
          sceneRef.current.focusOnPlanet(idx);
        }
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT_PLANET' });
        sceneRef.current?.resetView?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch, sceneRef]);

  return (
    <>
      <Loading />
      <SolarSystem3D ref={sceneRef} />
      <TopBar onOpenAchievements={() => setAchOpen(true)} />
      <Sidebar />
      <InfoPanel />
      <TimelineControls />
      <LabPanel />
      <ObservePanel />
      <KnowledgeView />
      <AchievementModal open={achOpen} onClose={() => setAchOpen(false)} />
      <Toast />
      <div id="tooltip" />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
