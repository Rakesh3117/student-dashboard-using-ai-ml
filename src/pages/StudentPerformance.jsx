import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiChevronRight, FiChevronLeft, FiUser } from 'react-icons/fi'
import PerformanceChart from '../components/charts/PerformanceChart'
import { useData } from '../context/DataContext'

function StudentPerformance() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getStudentById, getPredictionForStudent, students, loading, dataLoaded } = useData()
  const [student, setStudent] = useState([])
  const [prediction, setPrediction] = useState(null)
  
  
  useEffect(() => {
    if (dataLoaded && id) {
      const studentData = getStudentById(id)
      if (studentData) {
        setStudent(Array.isArray(data) ? data : []);

        
        // Get prediction if available
        const predictionData = getPredictionForStudent(id)
        setPrediction(predictionData)
      } else {
        // If student not found, redirect to the first student or dashboard
        if (students.length > 0) {
          navigate(`/student/${student[0]?.id}`)
        } else {
          navigate('/')
        }
      }
    }
  }, [id, dataLoaded, getStudentById, getPredictionForStudent, students, navigate])

  // Navigate to previous/next student
  const navigateToStudent = (direction) => {
    const currentIndex = students.findIndex(s => s.id === parseInt(id))
    if (currentIndex !== -1) {
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % students.length 
        : (currentIndex - 1 + students.length) % students.length
      navigate(`/student/${students[newIndex].id}`)
    }
  }

  if (loading || !student) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const subjects = student.subjects || []
  const scores = student.scores || []
  
  // Subject performance data
  const subjectData = {
    labels: subjects,
    datasets: [
      {
        label: 'Student Score',
        data: scores,
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
      },
      {
        label: 'Class Average',
        data: student.class_averages || subjects.map(() => 75),
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 2,
      },
    ],
  }

  // Time series data for performance trend
  const trendData = {
    labels: student.time_periods || ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
    datasets: [
      {
        label: 'Performance Over Time',
        data: student.trend_data || [75, 78, 80, 82],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/class-performance')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Student Performance</h1>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={() => navigateToStudent('prev')}
            className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Previous student"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
         {Array.isArray(students) && (
  <span className="mx-2 text-sm text-gray-500">
    {students.findIndex(s => s.id === parseInt(id)) + 1} of {students.length}
  </span>
)}
          <button
            onClick={() => navigateToStudent('next')}
            className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Next student"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
              {student.name?.charAt(0) || <FiUser className="h-8 w-8" />}
            </div>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-gray-500">Student ID: {student.id}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`badge ${
                student.overall_score >= 90 ? 'badge-success' :
                student.overall_score >= 80 ? 'bg-primary-100 text-primary-700' :
                student.overall_score >= 70 ? 'bg-secondary-100 text-secondary-700' :
                student.overall_score >= 60 ? 'badge-warning' :
                'badge-error'
              }`}>
                Overall: {student.overall_score?.toFixed(1) || 0}
              </span>
              
              <span className={`badge ${
                student.attendance >= 90 ? 'badge-success' :
                student.attendance >= 80 ? 'bg-primary-100 text-primary-700' :
                student.attendance >= 70 ? 'bg-secondary-100 text-secondary-700' :
                student.attendance >= 60 ? 'badge-warning' :
                'badge-error'
              }`}>
                Attendance: {student.attendance?.toFixed(1) || 0}%
              </span>
              
              {student.grade && (
                <span className="badge bg-gray-100 text-gray-700">
                  Grade: {student.grade}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col justify-center">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Percentile Rank</h3>
              <p className="text-2xl font-bold text-gray-800">{student.percentile || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {prediction && (
        <div className="card bg-accent-50 border border-accent-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Performance Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Predicted Final Score</h3>
              <p className="text-2xl font-bold text-accent-700">
                {prediction.predicted_score?.toFixed(1) || '-'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on current performance
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Confidence Level</h3>
              <p className="text-2xl font-bold text-accent-700">
                {prediction.confidence?.toFixed(0) || '-'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Prediction accuracy
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Growth Potential</h3>
              <p className="text-2xl font-bold text-accent-700">
                {prediction.growth_potential || '-'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {prediction.growth_potential === 'High' ? '10+ points possible improvement' :
                 prediction.growth_potential === 'Medium' ? '5-10 points possible improvement' :
                 'Less than 5 points expected growth'}
              </p>
            </div>
          </div>
          
          {prediction.recommendations && (
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
              <ul className="space-y-1 text-sm">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-accent-500">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject Performance</h2>
          <PerformanceChart data={subjectData} type="bar" />
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h2>
          <PerformanceChart data={trendData} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Average
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject, idx) => (
                <tr key={subject} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scores[idx]?.toFixed(1) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(student.class_averages?.[idx] || '-')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.subject_percentiles?.[idx] || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scores[idx] >= 90 ? 'bg-success-100 text-success-700' :
                      scores[idx] >= 80 ? 'bg-primary-100 text-primary-700' :
                      scores[idx] >= 70 ? 'bg-secondary-100 text-secondary-700' :
                      scores[idx] >= 60 ? 'bg-warning-100 text-warning-700' :
                      'bg-error-100 text-error-700'
                    }`}>
                      {scores[idx] >= 90 ? 'A' :
                       scores[idx] >= 80 ? 'B' :
                       scores[idx] >= 70 ? 'C' :
                       scores[idx] >= 60 ? 'D' : 'F'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentPerformance