import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import ClassPerformance from './pages/ClassPerformance'
import StudentPerformance from './pages/StudentPerformance'
import Predictions from './pages/Predictions'
import Settings from './pages/Settings'
import UploadData from './pages/UploadData'
import { DataProvider } from './context/DataContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/class-performance" element={<ClassPerformance />} />
              <Route path="/student/:id" element={<StudentPerformance />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/upload" element={<UploadData />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </DataProvider>
  )
}

export default App