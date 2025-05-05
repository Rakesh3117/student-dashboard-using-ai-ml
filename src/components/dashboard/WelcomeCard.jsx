import { FiUpload, FiBarChart2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'

function WelcomeCard() {
  const { dataLoaded } = useData()

  return (
    <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white animate-fade-in">
      <h2 className="text-2xl font-bold">
        Welcome to StudyPulse
      </h2>
      <p className="mt-2">
        {dataLoaded 
          ? 'Your student performance data is ready for analysis. Explore the dashboard to gain insights.'
          : 'Start by uploading your student data or generating random data to see predictions.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {!dataLoaded ? (
          <Link 
            to="/upload" 
            className="inline-flex items-center px-4 py-2 bg-white text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
          >
            <FiUpload className="mr-2" />
            Get Started
          </Link>
        ) : (
          <Link 
            to="/predictions" 
            className="inline-flex items-center px-4 py-2 bg-white text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
          >
            <FiBarChart2 className="mr-2" />
            View Predictions
          </Link>
        )}
      </div>
    </div>
  )
}

export default WelcomeCard