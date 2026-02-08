import { useState, useEffect } from 'react';
import { DeckProvider } from './context/DeckContext';
import { PitchProvider } from './context/PitchContext';
import { DashboardPRD } from './components/DashboardPRD';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [hasStarted, setHasStarted] = useState(() => window.location.pathname === '/dashboard');
  const [mode] = useState<'prd' | 'classic'>('prd'); // Default to new PRD mode

  useEffect(() => {
    const handlePopState = () => {
      setHasStarted(window.location.pathname === '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <DeckProvider>
      <PitchProvider>
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <LandingPage onStart={() => {
                window.history.pushState({}, '', '/dashboard');
                setHasStarted(true);
              }} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {mode === 'prd' ? <DashboardPRD /> : <Dashboard />}
            </motion.div>
          )}
        </AnimatePresence>
      </PitchProvider>
    </DeckProvider>
  );
}

export default App;
