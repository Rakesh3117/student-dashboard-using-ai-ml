import { useState } from 'react'
import { FiSave, FiRefreshCw, FiDownload } from 'react-icons/fi'
import { useData } from '../context/DataContext'

function Settings() {
  const { exportData, generateRandomData, loading } = useData()
  const [saved, setSaved] = useState(false)
  
  // Model settings (these would typically connect to backend settings)
  const [settings, setSettings] = useState({
    modelType: 'random_forest',
    testSize: 0.2,
    confidenceThreshold: 0.75,
    featuresIncluded: ['attendance', 'previous_scores', 'assignments'],
    predictionHorizon: 'end_of_term',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      // Handle checkbox updates for featuresIncluded
      const updatedFeatures = [...settings.featuresIncluded]
      if (checked) {
        updatedFeatures.push(name)
      } else {
        const index = updatedFeatures.indexOf(name)
        if (index > -1) {
          updatedFeatures.splice(index, 1)
        }
      }
      setSettings(prev => ({ ...prev, featuresIncluded: updatedFeatures }))
    } else {
      setSettings(prev => ({ ...prev, [name]: value }))
    }
    
    // Reset saved state when any setting changes
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically update settings on the backend
    console.log('Saving settings:', settings)
    
    // Simulate success
    setTimeout(() => {
      setSaved(true)
    }, 800)
  }

  const isFeatureIncluded = (feature) => {
    return settings.featuresIncluded.includes(feature)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Model Settings</h2>
          
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="modelType" className="label">Model Type</label>
              <select
                id="modelType"
                name="modelType"
                value={settings.modelType}
                onChange={handleChange}
                className="input"
              >
                <option value="random_forest">Random Forest</option>
                <option value="linear_regression">Linear Regression</option>
                <option value="neural_network">Neural Network</option>
                <option value="gradient_boosting">Gradient Boosting</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="predictionHorizon" className="label">Prediction Horizon</label>
              <select
                id="predictionHorizon"
                name="predictionHorizon"
                value={settings.predictionHorizon}
                onChange={handleChange}
                className="input"
              >
                <option value="end_of_term">End of Term</option>
                <option value="end_of_year">End of Year</option>
                <option value="next_assessment">Next Assessment</option>
                <option value="graduation">Graduation</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="testSize" className="label">
                Test Data Size
                <span className="ml-1 text-sm text-gray-500">({(settings.testSize * 100).toFixed(0)}%)</span>
              </label>
              <input
                type="range"
                id="testSize"
                name="testSize"
                min="0.1"
                max="0.5"
                step="0.05"
                value={settings.testSize}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="confidenceThreshold" className="label">
                Confidence Threshold
                <span className="ml-1 text-sm text-gray-500">({(settings.confidenceThreshold * 100).toFixed(0)}%)</span>
              </label>
              <input
                type="range"
                id="confidenceThreshold"
                name="confidenceThreshold"
                min="0.5"
                max="0.95"
                step="0.05"
                value={settings.confidenceThreshold}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="label">Features to Include</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="attendance"
                  name="attendance"
                  checked={isFeatureIncluded('attendance')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="attendance" className="ml-2 text-sm text-gray-700">
                  Attendance
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="previous_scores"
                  name="previous_scores"
                  checked={isFeatureIncluded('previous_scores')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="previous_scores" className="ml-2 text-sm text-gray-700">
                  Previous Scores
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="assignments"
                  name="assignments"
                  checked={isFeatureIncluded('assignments')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="assignments" className="ml-2 text-sm text-gray-700">
                  Assignments
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="participation"
                  name="participation"
                  checked={isFeatureIncluded('participation')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="participation" className="ml-2 text-sm text-gray-700">
                  Participation
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="quiz_results"
                  name="quiz_results"
                  checked={isFeatureIncluded('quiz_results')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="quiz_results" className="ml-2 text-sm text-gray-700">
                  Quiz Results
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="study_time"
                  name="study_time"
                  checked={isFeatureIncluded('study_time')}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="study_time" className="ml-2 text-sm text-gray-700">
                  Study Time
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              <FiSave className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
        
        {saved && (
          <div className="bg-success-50 text-success-700 p-3 rounded-md border border-success-200 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved successfully
          </div>
        )}
      </form>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-gray-800">Regenerate Random Data</h3>
              <p className="text-sm text-gray-600">Create a new set of random data for testing</p>
            </div>
            <button
              onClick={generateRandomData}
              className="btn btn-outline flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-primary-500 rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Generate Data
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-gray-800">Export All Data</h3>
              <p className="text-sm text-gray-600">Download all data including predictions</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportData('csv')}
                className="btn btn-outline flex items-center"
                disabled={loading}
              >
                <FiDownload className="mr-2" />
                CSV
              </button>
              <button
                onClick={() => exportData('xlsx')}
                className="btn btn-outline flex items-center"
                disabled={loading}
              >
                <FiDownload className="mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings