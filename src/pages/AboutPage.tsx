import React from 'react';
import Card from '../components/ui/Card';
import { GraduationCap, Brain, LineChart, Users, FileText, Github } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4 text-blue-600">
          <GraduationCap className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Performance Predictor</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          An educational tool using machine learning to predict academic performance
        </p>
      </div>
      
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Project</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Student Performance Predictor is an educational tool designed to help teachers and educational institutions 
                predict student academic performance based on various factors.
              </p>
              <p>
                The application uses a machine learning model to analyze patterns in student data and provide insights 
                on how different factors affect academic outcomes. This can help identify at-risk students early and 
                implement targeted interventions.
              </p>
              <p>
                While this demo version uses a simplified model for demonstration purposes, the approach can be extended 
                with more sophisticated algorithms and additional data points for real-world applications.
              </p>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center items-center">
            <div className="h-52 w-52 bg-blue-50 rounded-full flex items-center justify-center">
              <Brain className="h-24 w-24 text-blue-500" />
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-blue-600" />
            Key Features
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full text-blue-700 mr-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Performance prediction based on multiple factors</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full text-blue-700 mr-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Interactive data visualization and analytics</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full text-blue-700 mr-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Feature importance analysis to understand key factors</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full text-blue-700 mr-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Batch prediction for analyzing multiple students</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full text-blue-700 mr-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>CSV data import for easy integration</span>
            </li>
          </ul>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Who Can Use This?
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg text-green-700 mr-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <strong className="block text-gray-800">Teachers & Professors</strong>
                <span className="text-sm">Identify at-risk students and provide targeted help</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-700 mr-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <strong className="block text-gray-800">Educational Institutions</strong>
                <span className="text-sm">Develop data-driven strategies for improving outcomes</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-700 mr-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <strong className="block text-gray-800">Educational Researchers</strong>
                <span className="text-sm">Study the correlation between various factors and academic performance</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-700 mr-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <strong className="block text-gray-800">Students</strong>
                <span className="text-sm">Understand what factors might affect their academic success</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          How the Model Works
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            This application uses a simplified machine learning model to demonstrate the concept 
            of student performance prediction. Here's how it works:
          </p>
          
          <div className="relative overflow-hidden">
            <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">1. Data Collection</h4>
                  <p className="text-sm">Gather student data (study hours, previous scores, etc.) via CSV upload or demo generation</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">2. Model Training</h4>
                  <p className="text-sm">The system analyzes patterns in the data to understand how factors relate to performance</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">3. Prediction</h4>
                  <p className="text-sm">New student data is evaluated based on learned patterns to predict their performance</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> In a production environment, more sophisticated algorithms like 
                  Random Forests, Gradient Boosting, or Neural Networks might be used for higher accuracy.
                </p>
              </div>
            </div>
            
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-6">
              <div className="bg-blue-600 text-white text-xs py-1 px-3 rounded-full">
                Model Overview
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
              <Github className="h-5 w-5 mr-2 text-blue-600" />
              Open Source Project
            </h3>
            <p className="text-gray-600">
              Contribute to this project or view the source code on GitHub
            </p>
          </div>
          
          <a
            href="https://github.com/alidiamond1/Student-Performance-Predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Github className="h-5 w-5 mr-2" />
            View on GitHub
          </a>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Machine Learning'].map(tech => (
              <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;