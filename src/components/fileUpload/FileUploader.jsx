import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiX, FiLoader } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

function FileUploader() {
  const [file, setFile] = useState(null)
  const { uploadFile, loading, generateRandomData } = useData()

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (file) {
      await uploadFile(file)
    }
  }

  const handleRandomData = async () => {
    await generateRandomData()
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Student Data</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className={`h-10 w-10 mb-3 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
        
        <p className="text-center text-sm text-gray-700">
          Drag & drop a CSV or Excel file here, or click to select
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: .csv, .xls, .xlsx
        </p>
      </div>

      {file && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <FiFile className="h-5 w-5 text-primary-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button 
            onClick={removeFile}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`btn btn-primary w-full ${
            !file || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin h-4 w-4 mr-2" />
              Processing...
            </>
          ) : (
            <>Upload and Process</>
          )}
        </button>
        
        <div className="flex items-center">
          <hr className="flex-grow border-gray-200" />
          <span className="px-3 text-xs text-gray-500">OR</span>
          <hr className="flex-grow border-gray-200" />
        </div>
        
        <button
          onClick={handleRandomData}
          disabled={loading}
          className={`btn btn-outline w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin h-4 w-4 mr-2" />
              Generating...
            </>
          ) : (
            <>Generate Random Data</>
          )}
        </button>
      </div>
    </div>
  )
}

export default FileUploader