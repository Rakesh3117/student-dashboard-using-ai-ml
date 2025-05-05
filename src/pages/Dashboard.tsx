import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/data/DataTable';
import FeatureImportanceChart from '../components/data/FeatureImportanceChart';
import ScatterPlot from '../components/data/ScatterPlot';
import { useData } from '../contexts/DataContext';
import { useModel } from '../contexts/ModelContext';
import { BarChart, PieChart, Download, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { students, generateDemoData, clearData } = useData();
  const { 
    modelTrained, 
    accuracy, 
    featureImportance, 
    isTraining, 
    isPredicting,
    trainModel, 
    predictBatch,
    resetModel
  } = useModel();

  // Generate scatter plot data for study hours vs. predicted score
  const studyHoursData = students
    .filter(student => student.predictedScore !== undefined)
    .map(student => ({
      x: student.studyHours,
      y: student.predictedScore as number
    }));

  // Generate scatter plot data for previous score vs. predicted score
  const previousScoreData = students
    .filter(student => student.predictedScore !== undefined)
    .map(student => ({
      x: student.previousScore,
      y: student.predictedScore as number
    }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Analyze and predict student performance based on various factors
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={generateDemoData}
            variant="outline"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Generate Demo Data
          </Button>
          
          {students.length > 0 && (
            <Button 
              onClick={clearData}
              variant="ghost"
              size="sm"
            >
              Clear Data
            </Button>
          )}
        </div>
      </div>

      {students.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card 
              title="Model Status" 
              className="lg:col-span-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${modelTrained ? "text-green-600" : "text-amber-600"}`}>
                    {modelTrained ? "Trained" : "Not Trained"}
                  </span>
                </div>
                
                {modelTrained && accuracy && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-semibold text-blue-600">
                      {(accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-semibold">{students.length}</span>
                </div>
                
                <div className="pt-2 space-y-3">
                  <Button
                    onClick={trainModel}
                    isLoading={isTraining}
                    disabled={isTraining || isPredicting}
                    fullWidth
                  >
                    {modelTrained ? "Retrain Model" : "Train Model"}
                  </Button>
                  
                  <Button
                    onClick={predictBatch}
                    disabled={!modelTrained || isTraining || isPredicting}
                    isLoading={isPredicting}
                    variant="secondary"
                    fullWidth
                  >
                    Predict All Students
                  </Button>
                  
                  {modelTrained && (
                    <Button
                      onClick={resetModel}
                      variant="outline"
                      fullWidth
                    >
                      Reset Model
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            
            <Card 
              title="Feature Importance" 
              subtitle="Relative impact of each factor on predictions"
              className="lg:col-span-2"
            >
              {featureImportance ? (
                <div className="h-64">
                  <FeatureImportanceChart featureImportance={featureImportance} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Train the model to see feature importance</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
          
          {students.some(s => s.predictedScore !== undefined) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                title="Study Hours vs. Predicted Score" 
                className="h-80"
              >
                {studyHoursData.length > 0 ? (
                  <ScatterPlot 
                    data={studyHoursData}
                    xLabel="Study Hours"
                    yLabel="Predicted Score"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Run predictions to see this chart</p>
                    </div>
                  </div>
                )}
              </Card>
              
              <Card 
                title="Previous Score vs. Predicted Score" 
                className="h-80"
              >
                {previousScoreData.length > 0 ? (
                  <ScatterPlot 
                    data={previousScoreData}
                    xLabel="Previous Score"
                    yLabel="Predicted Score"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Run predictions to see this chart</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
          
          <Card title="Student Data">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-gray-700 font-medium">
                {students.some(s => s.predictedScore !== undefined) 
                  ? "Students with Predictions" 
                  : "Students (No Predictions Yet)"}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                onClick={() => {
                  // This would typically export to CSV
                  alert("CSV export functionality would go here");
                }}
              >
                Export Data
              </Button>
            </div>
            
            <DataTable data={students} />
          </Card>
        </>
      ) : (
        <div className="mt-10 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <GraduationCapIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Student Data Available</h2>
            <p className="text-gray-600 mb-6">
              To get started, generate demo data or upload your own student data.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={generateDemoData}
                icon={<RefreshCw className="h-4 w-4" />}
                size="lg"
              >
                Generate Demo Data
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Your Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Graduation Cap Icon Component
const GraduationCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

export default Dashboard;