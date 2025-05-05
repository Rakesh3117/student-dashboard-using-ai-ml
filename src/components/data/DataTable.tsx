import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Student {
  id: number;
  studyHours: number;
  previousScore: number;
  attendance: number;
  difficulty: number;
  internetAccess: boolean;
  predictedScore?: number;
}

interface DataTableProps {
  data: Student[];
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading = false }) => {
  const [sortField, setSortField] = useState<keyof Student>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] === b[sortField]) return 0;
    
    if (sortField === 'internetAccess') {
      return sortDirection === 'asc'
        ? (a[sortField] ? 1 : -1)
        : (a[sortField] ? -1 : 1);
    }
    
    return sortDirection === 'asc'
      ? (a[sortField] < b[sortField] ? -1 : 1)
      : (a[sortField] < b[sortField] ? 1 : -1);
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available. Please upload a CSV file or generate demo data.
      </div>
    );
  }

  const SortIcon = ({ field }: { field: keyof Student }) => (
    <span className="inline-flex ml-1">
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <Filter className="h-4 w-4 opacity-30" />
      )}
    </span>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('id')}
            >
              ID <SortIcon field="id" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('studyHours')}
            >
              Study Hours <SortIcon field="studyHours" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('previousScore')}
            >
              Previous Score <SortIcon field="previousScore" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('attendance')}
            >
              Attendance % <SortIcon field="attendance" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('difficulty')}
            >
              Difficulty <SortIcon field="difficulty" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('internetAccess')}
            >
              Internet <SortIcon field="internetAccess" />
            </th>
            <th 
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:bg-gray-100"
              onClick={() => handleSort('predictedScore')}
            >
              Predicted Score <SortIcon field="predictedScore" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{student.id + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{student.studyHours.toFixed(1)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{student.previousScore}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{student.attendance.toFixed(1)}%</td>
              <td className="px-6 py-4 text-sm text-gray-900">{student.difficulty.toFixed(1)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <span className={cn(
                  "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                  student.internetAccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {student.internetAccess ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {student.predictedScore !== undefined ? (
                  <span className={cn(
                    "font-medium",
                    student.predictedScore >= 70 ? "text-green-600" : 
                    student.predictedScore >= 50 ? "text-amber-600" : "text-red-600"
                  )}>
                    {student.predictedScore}
                  </span>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;