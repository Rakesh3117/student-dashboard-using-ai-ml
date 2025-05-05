import FileUploader from '../components/fileUpload/FileUploader'
import { FiUpload, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { useData } from '../context/DataContext'

function UploadData() {
  const { dataLoaded, modelTrained, loading, generateRandomData } = useData()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Management</h2>
        <p className="text-gray-600 mb-4">
          Upload your student performance data in CSV or Excel format to analyze and predict performance trends.
          Alternatively, you can generate random data for demonstration purposes.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
            <div className="bg-primary-100 p-3 rounded-full mb-3">
              <FiUpload className="h-6 w-6 text-primary-700" />
            </div>
            <h3 className="font-medium text-gray-900">Upload Data</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              CSV or Excel formats
            </p>
            <div className="text-xs text-primary-700">
              {dataLoaded ? '✓ Data loaded' : 'No data loaded'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
            <div className="bg-secondary-100 p-3 rounded-full mb-3">
              <FiRefreshCw className="h-6 w-6 text-secondary-700" />
            </div>
            <h3 className="font-medium text-gray-900">Train Model</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Process performance data
            </p>
            <div className="text-xs text-secondary-700">
              {modelTrained ? '✓ Model trained' : 'No model trained'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
            <div className="bg-accent-100 p-3 rounded-full mb-3">
              <FiDownload className="h-6 w-6 text-accent-700" />
            </div>
            <h3 className="font-medium text-gray-900">Export Results</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Download predictions
            </p>
            <div className="text-xs text-accent-700">
              {dataLoaded && modelTrained ? 'Available' : 'Not available'}
            </div>
          </div>
        </div>
      </div>

      <FileUploader />

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Format Requirements</h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>
            For best results, your data file should contain the following columns:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>student_id</strong>: Unique identifier for each student</li>
            <li><strong>name</strong>: Student's name</li>
            <li><strong>subjects</strong>: Subject names (can be multiple columns)</li>
            <li><strong>scores</strong>: Corresponding scores for each subject</li>
            <li><strong>attendance</strong>: Attendance percentage (optional)</li>
            <li><strong>assignments_completed</strong>: Number or percentage of completed assignments (optional)</li>
          </ul>
          
          <p className="mt-4">
            Additional data that can improve prediction accuracy:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Previous term/semester scores</li>
            <li>Participation metrics</li>
            <li>Time spent on learning activities</li>
            <li>Quiz and test results</li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Data Format</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border">student_id</th>
                  <th className="px-3 py-2 border">name</th>
                  <th className="px-3 py-2 border">math</th>
                  <th className="px-3 py-2 border">science</th>
                  <th className="px-3 py-2 border">english</th>
                  <th className="px-3 py-2 border">attendance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border">1</td>
                  <td className="px-3 py-2 border">John Smith</td>
                  <td className="px-3 py-2 border">85</td>
                  <td className="px-3 py-2 border">78</td>
                  <td className="px-3 py-2 border">92</td>
                  <td className="px-3 py-2 border">95</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 border">2</td>
                  <td className="px-3 py-2 border">Jane Doe</td>
                  <td className="px-3 py-2 border">92</td>
                  <td className="px-3 py-2 border">88</td>
                  <td className="px-3 py-2 border">95</td>
                  <td className="px-3 py-2 border">98</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {dataLoaded && (
        <div className="card bg-success-50 border border-success-100">
          <div className="flex items-start">
            <div className="bg-success-100 p-2 rounded-full mr-4">
              <svg className="h-6 w-6 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Data Successfully Loaded</h2>
              <p className="text-gray-600 mt-1">
                Your data has been processed and the prediction model is ready.
                You can now explore the dashboard, view class performance, and check predictions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadData