import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiSearch, FiUser, FiHelpCircle, FiBell } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

function Navbar({ onMenuButtonClick }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { dataLoaded } = useData()
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={onMenuButtonClick}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <img
                className="h-8 w-auto"
                src="/analytics-icon.svg"
                alt="Student Performance Predictor"
              />
              <span className="ml-2 text-xl font-semibold text-primary-700 hidden sm:block">
                StudyPulse
              </span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                className="input pl-10 py-1.5 text-sm"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!dataLoaded}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <FiBell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none ml-2">
              <FiHelpCircle className="h-5 w-5" />
            </button>
            <div className="ml-3 relative">
              <button className="flex items-center p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-primary-700" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar