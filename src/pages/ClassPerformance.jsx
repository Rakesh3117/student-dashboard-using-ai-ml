import { FiDownload, FiBarChart2 } from 'react-icons/fi'
import PerformanceChart from '../components/charts/PerformanceChart'
import { useData } from '../context/DataContext'
import { Link } from 'react-router-dom'

function ClassPerformance() {
  const { classData, students, loading, dataLoaded, exportData } = useData()

  // Time series data for trends
  const trendData = {
    labels: classData?.timeLabels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Average Score',
        data: classData?.trendData || [72, 74, 79, 80, 81, 83],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Class Performance</h1>
        
        {dataLoaded && (
          <div className="flex gap-2">
            <button
              onClick={() => exportData('csv')}
              className="btn btn-outline flex items-center text-sm"
            >
              <FiDownload className="mr-1" /> 
              Export CSV
            </button>
            <button
              onClick={() => exportData('xlsx')}
              className="btn btn-outline flex items-center text-sm"
            >
              <FiDownload className="mr-1" /> 
              Export Excel
            </button>
          </div>
        )}
      </div>

      {dataLoaded && !loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-primary-50 border border-primary-100">
              <h3 className="text-lg font-medium text-primary-900">Class Average</h3>
              <p className="text-3xl font-bold text-primary-700 mt-2">
                {classData?.overallAverage?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-primary-600 mt-1">Out of 100 points</p>
            </div>
            
            <div className="card bg-secondary-50 border border-secondary-100">
              <h3 className="text-lg font-medium text-secondary-900">Passing Rate</h3>
              <p className="text-3xl font-bold text-secondary-700 mt-2">
                {classData?.passingRate?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-secondary-600 mt-1">
                {classData?.passingCount || 0} of {classData?.totalStudents || 0} students
              </p>
            </div>
            
            <div className="card bg-accent-50 border border-accent-100">
              <h3 className="text-lg font-medium text-accent-900">Performance Index</h3>
              <p className="text-3xl font-bold text-accent-700 mt-2">
                {classData?.performanceIndex?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-accent-600 mt-1">
                {classData?.performanceLevel || 'Average'} performance level
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h2>
            <PerformanceChart data={trendData} height={250} />
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Student Rankings</h2>
              <Link to="/predictions" className="text-primary-600 text-sm hover:text-primary-800 flex items-center">
                <FiBarChart2 className="mr-1" />
                View Predictions
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(students) &&
  students.slice(0, 10).map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
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
                        {student.overall_score?.toFixed(1) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.overall_score >= 90 ? 'bg-success-100 text-success-700' :
                          student.overall_score >= 80 ? 'bg-primary-100 text-primary-700' :
                          student.overall_score >= 70 ? 'bg-secondary-100 text-secondary-700' :
                          student.overall_score >= 60 ? 'bg-warning-100 text-warning-700' :
                          'bg-error-100 text-error-700'
                        }`}>
                          {student.overall_score >= 90 ? 'Excellent' :
                           student.overall_score >= 80 ? 'Good' :
                           student.overall_score >= 70 ? 'Average' :
                           student.overall_score >= 60 ? 'Below Average' :
                           'At Risk'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.trend === 'up' ? (
                          <span className="text-success-500">↑ Improving</span>
                        ) : student.trend === 'down' ? (
                          <span className="text-error-500">↓ Declining</span>
                        ) : (
                          <span className="text-gray-500">→ Stable</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link to={`/student/${student.id}`} className="text-primary-600 hover:text-primary-900">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {students.length > 10 && (
              <div className="flex justify-center mt-4">
                <button className="btn btn-outline text-sm">
                  View All Students
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card bg-gray-50 border border-gray-200">
          <div className="text-center py-8">
            <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Class Data Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? 'Loading data...' : 'Please upload student data to view class performance.'}
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

export default ClassPerformance