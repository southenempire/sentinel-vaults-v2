import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Docs from './pages/Docs';
import Dashboard from './pages/Dashboard';
import AgentTerminal from './pages/AgentTerminal';

import { LogProvider } from './context/LogContext';

export default function App() {
  return (
    <ThemeProvider>
      <LogProvider>
        <Router>
          <Routes>
            {/* Public Marketing Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/docs" element={<Docs />} />
            </Route>

            {/* Dashboard with Sidebar Navigation */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="rules" element={<Dashboard />} />
              <Route path="logs" element={<Dashboard />} />
              <Route path="agent" element={<AgentTerminal />} />
            </Route>
          </Routes>
        </Router>
      </LogProvider>
    </ThemeProvider>
  );
}
