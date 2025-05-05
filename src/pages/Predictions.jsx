import { FiArrowRight, FiDownload } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PerformanceChart from '../components/charts/PerformanceChart'
import { useData } from '../context/DataContext'

function Predictions() {
  const { predictions, students, classData, loading, dataLoaded, exportData } = useData()

  // Example prediction distribution data
  const predictionDistributionData = {
    labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'],
    datasets: [
      {
        label: 'Current Distribution',
        data: classData?.gradeDistribution || [5, 10, 15, 8, 2],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Predicted Distribution',
        data: classData?.predictedDistribution || [7, 12, 14, 5, 2],
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Performance Predictions</h1>
        
        {dataLoaded && (
          <button
            onClick={() => exportData('csv')}
            className="btn btn-outline flex items-center text-sm"
          >
            <FiDownload className="mr-1" /> 
            Export Predictions
          </button>
        )}
      </div>

      {dataLoaded && !loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-accent-50 border border-accent-100">
              <h3 className="text-lg font-medium text-accent-900">Predicted Class Average</h3>
              <p className="text-3xl font-bold text-accent-700 mt-2">
                {classData?.predictedAverage?.toFixed(1) || 0}
              </p>
              <div className="flex items-center mt-1 text-sm">
                <span className={`${
                  ((classData?.predictedAverage || 0) > (classData?.overallAverage || 0)) 
                    ? 'text-success-500' 
                    : 'text-error-500'
                }`}>
                  {
                    ((classData?.predictedAverage || 0) > (classData?.overallAverage || 0))
                      ? '▲ ' 
                      : '▼ '
                  }
                  {Math.abs(((classData?.predictedAverage || 0) - (classData?.overallAverage || 0))).toFixed(1)}
                </span>
                <span className="text-accent-600 ml-1">
                  points from current average
                </span>
              </div>
            </div>
            
            <div className="card bg-accent-50 border border-accent-100">
              <h3 className="text-lg font-medium text-accent-900">Students Improving</h3>
              <p className="text-3xl font-bold text-accent-700 mt-2">
                {classData?.improvingCount || 0}
              </p>
              <p className="text-sm text-accent-600 mt-1">
                {classData?.improvingPercent?.toFixed(0) || 0}% of all students
              </p>
            </div>
            
            <div className="card bg-accent-50 border border-accent-100">
              <h3 className="text-lg font-medium text-accent-900">Model Accuracy</h3>
              <p className="text-3xl font-bold text-accent-700 mt-2">
                {classData?.modelAccuracy?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-accent-600 mt-1">
                Based on historical performance
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Predicted Grade Distribution</h2>
            <PerformanceChart data={predictionDistributionData} type="bar" />
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Student Predictions</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Predicted Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(students) && students.slice(0, 10).map((student) => {
                    const prediction = predictions.find(p => p.student_id === student.id)
                    const currentScore = student.overall_score || 0
                    const predictedScore = prediction?.predicted_score || 0
                    const scoreDiff = predictedScore - currentScore
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {student.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {currentScore.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {predictedScore.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${
                            scoreDiff > 0 
                              ? 'text-success-500' 
                              : scoreDiff < 0 
                                ? 'text-error-500' 
                                : 'text-gray-500'
                          }`}>
                            {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prediction?.risk_level === 'High' ? 'bg-error-100 text-error-700' :
                            prediction?.risk_level === 'Medium' ? 'bg-warning-100 text-warning-700' :
                            'bg-success-100 text-success-700'
                          }`}>
                            {prediction?.risk_level || 'Low'} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link to={`/student/${student.id}`} className="text-primary-600 hover:text-primary-900 inline-flex items-center">
                            Details <FiArrowRight className="ml-1" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {students.length > 10 && (
              <div className="flex justify-center mt-4">
                <button className="btn btn-outline text-sm">
                  View All Predictions
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card bg-gray-50 border border-gray-200">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Prediction Data Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? 'Loading predictions...' : 'Please upload student data to generate predictions.'}
            </p>
            {!loading && !dataLoaded && (
              <Link to="/upload" className="mt-4 inline-flex items-center btn btn-primary">
                Upload Data
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Predictions