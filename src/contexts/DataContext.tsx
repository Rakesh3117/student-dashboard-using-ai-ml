import React, { createContext, useContext, useState, useCallback } from 'react';
import Papa from 'papaparse';
import { generateRandomData } from '../lib/utils';

interface Student {
  id: number;
  studyHours: number;
  previousScore: number;
  attendance: number;
  difficulty: number;
  internetAccess: boolean;
  predictedScore?: number;
}

interface DataContextType {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  uploadData: (file: File) => Promise<void>;
  generateDemoData: () => void;
  clearData: () => void;
  updatePredictions: (predictions: Record<number, number>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadData = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parseResult = await new Promise<Papa.ParseResult<unknown>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error) => reject(error),
        });
      });
      
      if (parseResult.errors.length > 0) {
        throw new Error('Error parsing CSV: ' + parseResult.errors[0].message);
      }
      
      // Process and validate the data
      const processedData = (parseResult.data as any[]).map((row, index) => {
        return {
          id: index,
          studyHours: parseFloat(row.studyHours) || 0,
          previousScore: parseFloat(row.previousScore) || 0,
          attendance: parseFloat(row.attendance) || 0,
          difficulty: parseFloat(row.difficulty) || 3,
          internetAccess: row.internetAccess === 'true' || row.internetAccess === '1',
        };
      });
      
      setStudents(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateDemoData = useCallback(() => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const demoData = generateRandomData(30);
      setStudents(demoData);
      setIsLoading(false);
    }, 800);
  }, []);

  const clearData = useCallback(() => {
    setStudents([]);
    setError(null);
  }, []);

  const updatePredictions = useCallback((predictions: Record<number, number>) => {
    setStudents(prev => 
      prev.map(student => ({
        ...student,
        predictedScore: predictions[student.id] || student.predictedScore
      }))
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        students,
        isLoading,
        error,
        uploadData,
        generateDemoData,
        clearData,
        updatePredictions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};