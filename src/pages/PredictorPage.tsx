import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useModel } from '../contexts/ModelContext';
import { BookOpen, Clock, CalendarCheck, Users, Wifi, Gauge, Award } from 'lucide-react';

interface PredictionFormValues {
  studyHours: number;
  previousScore: number;
  attendance: number;
  difficulty: number;
  internetAccess: boolean;
}

const PredictorPage: React.FC = () => {
  const { modelTrained, predictPerformance } = useModel();
  
  const [formValues, setFormValues] = useState<PredictionFormValues>({
    studyHours: 5,
    previousScore: 70,
    attendance: 85,
    difficulty: 3,
    internetAccess: true,
  });
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelTrained) {
      setError('Model must be trained before making predictions. Go to the Dashboard to train the model.');
      return;
    }
    
    setIsPredicting(true);
    setError(null);
    
    try {
      const result = await predictPerformance(formValues);
      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
    } finally {
      setIsPredicting(false);
    }
  };
  
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 70) return { label: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 60) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 50) return { label: 'Fair', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800 border-red-200' };
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Performance Predictor</h1>
      <p className="text-gray-600 mb-8">
        Enter student information to predict their academic performance
      </p>
      
      {!modelTrained && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
          <p className="flex items-center">
            <Gauge className="h-5 w-5 mr-2" />
            <span>The prediction model is not trained yet. Please visit the Dashboard to train the model first.</span>
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Student Information">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  type="number"
                  name="studyHours"
                  label="Study Hours (per day)"
                  value={formValues.studyHours}
                  onChange={handleNumberChange}
                  min={0}
                  max={24}
                  step={0.5}
                  leftIcon={<Clock className="h-4 w-4" />}
                  required
                  fullWidth
                />
                
                <Input
                  type="number"
                  name="previousScore"
                  label="Previous Score"
                  value={formValues.previousScore}
                  onChange={handleNumberChange}
                  min={0}
                  max={100}
                  step={1}
                  leftIcon={<BookOpen className="h-4 w-4" />}
                  required
                  fullWidth
                />
                
                <Input
                  type="number"
                  name="attendance"
                  label="Attendance (%)"
                  value={formValues.attendance}
                  onChange={handleNumberChange}
                  min={0}
                  max={100}
                  step={0.5}
                  leftIcon={<CalendarCheck className="h-4 w-4" />}
                  required
                  fullWidth
                />
                
                <Input
                  type="number"
                  name="difficulty"
                  label="Course Difficulty (1-5)"
                  value={formValues.difficulty}
                  onChange={handleNumberChange}
                  min={1}
                  max={5}
                  step={0.1}
                  leftIcon={<Gauge className="h-4 w-4" />}
                  helperText="1 is easiest, 5 is hardest"
                  required
                  fullWidth
                />
              </div>
              
              <div className="flex items-center space-x-3 pt-2">
                <Wifi className="h-5 w-5 text-gray-500" />
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="internetAccess"
                      checked={formValues.internetAccess}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner"></div>
                    <div className={`absolute left-0 top-0 w-5 h-5 rounded-full transition-transform transform ${formValues.internetAccess ? 'translate-x-5 bg-blue-600' : 'bg-white'} shadow`}></div>
                  </div>
                  <div className="ml-3 text-gray-700">
                    Internet Access at Home
                  </div>
                </label>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={isPredicting}
                  disabled={isPredicting || !modelTrained}
                  fullWidth
                  size="lg"
                >
                  Predict Performance
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card title="Prediction Result" className="sticky top-4">
            {predictionResult !== null ? (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={predictionResult >= 80 ? "#10B981" : 
                                predictionResult >= 70 ? "#3B82F6" : 
                                predictionResult >= 60 ? "#FBBF24" : 
                                predictionResult >= 50 ? "#F97316" : "#EF4444"}
                        strokeWidth="2"
                        strokeDasharray={`${predictionResult}, 100`}
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
                        {predictionResult}%
                      </text>
                    </svg>
                  </div>
                </div>
                
                <p className="text-lg font-semibold mt-2">Predicted Score</p>
                
                <div className={`mt-4 py-2 px-4 rounded-full border ${getScoreCategory(predictionResult).color}`}>
                  <span className="font-medium">{getScoreCategory(predictionResult).label}</span>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Categories:</h4>
                  <div className="text-xs space-y-1 text-left">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>80-100: Excellent</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span>70-79: Good</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span>60-69: Average</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      <span>50-59: Fair</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span>0-49: Needs Improvement</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Enter student details and click "Predict Performance" to see results</p>
                </div>
              </div>
            )}
            
          </Card>
        </div>
      </div>
      
      
      <div className="mt-8">
        <Card title="How it Works" titleClassName="bg-blue-50 text-blue-800">
          <div className="space-y-4">
            <p className="text-gray-700">
              This predictive model analyzes multiple factors that influence student performance:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex space-x-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Study Hours</h4>
                  <p className="text-sm text-gray-600">Daily time spent studying has a strong correlation with academic success</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Previous Performance</h4>
                  <p className="text-sm text-gray-600">Past academic results often indicate future performance patterns</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <CalendarCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Attendance</h4>
                  <p className="text-sm text-gray-600">Regular class attendance ensures better understanding of materials</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Gauge className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Course Difficulty</h4>
                  <p className="text-sm text-gray-600">Complexity of the subject matter affects performance outcomes</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Wifi className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Internet Access</h4>
                  <p className="text-sm text-gray-600">Access to online resources can support learning and research</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Individual Factors</h4>
                  <p className="text-sm text-gray-600">The model considers various individual factors that influence learning</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PredictorPage;