import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([])
  const [classData, setClassData] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modelTrained, setModelTrained] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataStatusChecked, setDataStatusChecked] = useState(false)

  useEffect(() => {
    if (!dataStatusChecked) {
      checkDataStatus()
    }
  }, [dataStatusChecked])

  const checkDataStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/status')
      setDataLoaded(response.data.data_loaded)
      setModelTrained(response.data.model_trained)
      
      if (response.data.data_loaded) {
        fetchData()
      }
    } catch (error) {
      console.error('Error checking data status:', error)
      toast.error('Failed to connect to the server. Please ensure the backend is running.')
    } finally {
      setDataStatusChecked(true)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Get students data
      const studentsResponse = await axios.get('http://localhost:5000/api/students')
      setStudents(studentsResponse.data)
      
      // Get class performance data
      const classResponse = await axios.get('http://localhost:5000/api/class/performance')
      setClassData(classResponse.data)
      
      // Get predictions if model is trained
      if (modelTrained) {
        const predictionsResponse = await axios.get('http://localhost:5000/api/predictions')
        setPredictions(predictionsResponse.data)
      }
      
      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      await fetchData()
      setModelTrained(true)
      toast.success('File uploaded and processed successfully')
      return true
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(error.response?.data?.message || 'Failed to upload file')
      return false
    } finally {
      setLoading(false)
    }
  }

  const generateRandomData = async () => {
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/generate')
      
      await fetchData()
      setModelTrained(true)
      toast.success('Random data generated successfully')
      return true
    } catch (error) {
      console.error('Error generating random data:', error)
      toast.error('Failed to generate random data')
      return false
    } finally {
      setLoading(false)
    }
  }

  const getStudentById = (id) => {
    return students.find(student => student.id === parseInt(id))
  }

  const getPredictionForStudent = (id) => {
    return predictions.find(prediction => prediction.student_id === parseInt(id))
  }

  const exportData = async (format = 'csv') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/export?format=${format}`, {
        responseType: 'blob',
      })
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `student_data.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success(`Data exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error(`Failed to export data as ${format.toUpperCase()}`)
    }
  }

  const value = {
    students,
    classData,
    predictions,
    loading,
    dataLoaded,
    modelTrained,
    uploadFile,
    generateRandomData,
    getStudentById,
    getPredictionForStudent,
    exportData,
    refreshData: fetchData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}