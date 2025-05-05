import { Link, useLocation } from 'react-router-dom'
import { FiX, FiHome, FiUsers, FiUser, FiBarChart2, FiUpload, FiSettings } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

function Sidebar({ open, setOpen }) {
  const location = useLocation()
  const { dataLoaded } = useData()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Class Performance', href: '/class-performance', icon: FiUsers, requiresData: true },
    { name: 'Student Details', href: '/student/1', icon: FiUser, requiresData: true },
    { name: 'Predictions', href: '/predictions', icon: FiBarChart2, requiresData: true },
    { name: 'Upload Data', href: '/upload', icon: FiUpload },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/analytics-icon.svg"
              alt="Student Performance Predictor"
            />
            <span className="ml-2 text-xl font-semibold text-primary-700">StudyPulse</span>
          </Link>
          <button
            className="h-10 w-10 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none md:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            // Skip data-dependent items if no data is loaded
            if (item.requiresData && !dataLoaded) {
              return null
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive(item.href) ? 'text-primary-500' : 'text-gray-500'
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-primary-800">Need Help?</h4>
            <p className="text-xs text-primary-600 mt-1">
              Check our documentation for guides on how to use this application efficiently.
            </p>
            <a
              href="#"
              className="mt-2 inline-flex items-center text-xs font-medium text-primary-700 hover:text-primary-800"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar