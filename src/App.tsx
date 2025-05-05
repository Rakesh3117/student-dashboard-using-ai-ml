import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { ModelProvider } from './contexts/ModelContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import PredictorPage from './pages/PredictorPage';
import DataUploadPage from './pages/DataUploadPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <DataProvider>
        <ModelProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/predict" element={<PredictorPage />} />
                <Route path="/upload" element={<DataUploadPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ModelProvider>
      </DataProvider>
    </Router>
  );
}

export default App;