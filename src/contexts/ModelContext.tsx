import React, { createContext, useContext, useState, useCallback } from 'react';
import { useData } from './DataContext';
import { delay } from '../lib/utils';

interface ModelFeatures {
  studyHours: number;
  previousScore: number;
  attendance: number;
  difficulty: number;
  internetAccess: boolean;
}

type FeatureImportance = {
  [K in keyof ModelFeatures]: number;
};

interface ModelState {
  isTraining: boolean;
  isPredicting: boolean;
  modelTrained: boolean;
  accuracy: number | null;
  featureImportance: FeatureImportance | null;
  error: string | null;
}

interface ModelContextType extends ModelState {
  trainModel: () => Promise<void>;
  predictPerformance: (features: ModelFeatures) => Promise<number>;
  predictBatch: () => Promise<void>;
  resetModel: () => void;
}

const initialModelState: ModelState = {
  isTraining: false,
  isPredicting: false,
  modelTrained: false,
  accuracy: null,
  featureImportance: null,
  error: null,
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Mock ML model for frontend demonstration
// In a real app, this would use TensorFlow.js or call a backend API
class MockMLModel {
  private trained = false;
  private weights = {
    studyHours: 0,
    previousScore: 0,
    attendance: 0,
    difficulty: 0,
    internetAccess: 0,
    intercept: 0
  };

  async train(data: any[]): Promise<{ accuracy: number, importance: FeatureImportance }> {
    // Simulate training delay
    await delay(1500);
    
    // Generate random weights that make somewhat logical sense
    this.weights = {
      studyHours: 3 + Math.random() * 2,         // Higher impact
      previousScore: 0.5 + Math.random() * 0.3,  // Medium impact
      attendance: 0.2 + Math.random() * 0.4,     // Medium impact
      difficulty: -0.3 - Math.random() * 0.2,    // Negative impact
      internetAccess: 0.1 + Math.random() * 0.1, // Small positive impact
      intercept: 20 + Math.random() * 20,        // Base score
    };
    
    this.trained = true;
    
    // Calculate mock accuracy (80-95%)
    const accuracy = 0.8 + Math.random() * 0.15;
    
    // Calculate feature importance (normalized weights)
    const totalWeight = Object.values(this.weights)
      .filter(w => typeof w === 'number' && w > 0)
      .reduce((sum, w) => sum + Math.abs(w), 0);
    
    const importance: FeatureImportance = {
      studyHours: Math.abs(this.weights.studyHours) / totalWeight,
      previousScore: Math.abs(this.weights.previousScore) / totalWeight,
      attendance: Math.abs(this.weights.attendance) / totalWeight,
      difficulty: Math.abs(this.weights.difficulty) / totalWeight,
      internetAccess: Math.abs(this.weights.internetAccess) / totalWeight,
    };
    
    return { accuracy, importance };
  }

  predict(features: ModelFeatures): number {
    if (!this.trained) {
      throw new Error('Model not trained yet');
    }
    
    let score = this.weights.intercept;
    score += features.studyHours * this.weights.studyHours;
    score += features.previousScore * this.weights.previousScore;
    score += features.attendance * this.weights.attendance;
    score += features.difficulty * this.weights.difficulty;
    score += (features.internetAccess ? 1 : 0) * this.weights.internetAccess;
    
    // Clamp between 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modelState, setModelState] = useState<ModelState>(initialModelState);
  const { students, updatePredictions } = useData();
  const modelRef = React.useRef(new MockMLModel());

  const trainModel = useCallback(async () => {
    if (students.length === 0) {
      setModelState(prev => ({
        ...prev,
        error: 'No data available for training. Please upload or generate demo data.'
      }));
      return;
    }

    setModelState(prev => ({
      ...prev,
      isTraining: true,
      error: null
    }));

    try {
      const { accuracy, importance } = await modelRef.current.train(students);
      
      setModelState({
        isTraining: false,
        isPredicting: false,
        modelTrained: true,
        accuracy,
        featureImportance: importance,
        error: null,
      });
    } catch (err) {
      setModelState(prev => ({
        ...prev,
        isTraining: false,
        error: err instanceof Error ? err.message : 'Unknown error during training'
      }));
    }
  }, [students]);

  const predictPerformance = useCallback(async (features: ModelFeatures): Promise<number> => {
    if (!modelState.modelTrained) {
      throw new Error('Model must be trained before making predictions');
    }
    
    // Simulate prediction delay
    await delay(300);
    
    return modelRef.current.predict(features);
  }, [modelState.modelTrained]);

  const predictBatch = useCallback(async () => {
    if (!modelState.modelTrained) {
      setModelState(prev => ({
        ...prev,
        error: 'Model must be trained before making predictions'
      }));
      return;
    }

    if (students.length === 0) {
      setModelState(prev => ({
        ...prev,
        error: 'No data available for prediction'
      }));
      return;
    }

    setModelState(prev => ({
      ...prev,
      isPredicting: true,
      error: null
    }));

    try {
      // Simulate batch prediction delay
      await delay(800);
      
      const predictions: Record<number, number> = {};
      
      for (const student of students) {
        predictions[student.id] = modelRef.current.predict({
          studyHours: student.studyHours,
          previousScore: student.previousScore,
          attendance: student.attendance,
          difficulty: student.difficulty,
          internetAccess: student.internetAccess,
        });
      }
      
      updatePredictions(predictions);
      
      setModelState(prev => ({
        ...prev,
        isPredicting: false,
      }));
    } catch (err) {
      setModelState(prev => ({
        ...prev,
        isPredicting: false,
        error: err instanceof Error ? err.message : 'Unknown error during prediction'
      }));
    }
  }, [modelState.modelTrained, students, updatePredictions]);

  const resetModel = useCallback(() => {
    modelRef.current = new MockMLModel();
    setModelState(initialModelState);
  }, []);

  return (
    <ModelContext.Provider
      value={{
        ...modelState,
        trainModel,
        predictPerformance,
        predictBatch,
        resetModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};