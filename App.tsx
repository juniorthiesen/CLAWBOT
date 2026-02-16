import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Resources } from './pages/Resources';
import { Calibration } from './pages/Calibration';
import { TaskModal } from './components/TaskModal';

function App() {
  return (
    <AppProvider>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="calibration" element={<Calibration />} />
                    {/* Placeholders */}
                    <Route path="tasks" element={<div className="p-12 text-primary font-mono animate-pulse">SYSTEM MODULE OFFLINE // UNDER MAINTENANCE</div>} />
                    <Route path="logs" element={<div className="p-12 text-primary font-mono animate-pulse">ACCESS DENIED // LOGS ENCRYPTED</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </HashRouter>
        <TaskModal />
    </AppProvider>
  );
}

export default App;