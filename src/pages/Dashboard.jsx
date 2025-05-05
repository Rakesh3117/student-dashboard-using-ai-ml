import { useEffect, useCallback } from 'react';
import { FiUsers, FiTrendingUp, FiAward, FiAlertCircle } from 'react-icons/fi';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsCard from '../components/dashboard/StatsCard';
import PerformanceChart from '../components/charts/PerformanceChart';
import { useData } from '../context/DataContext';

// Utility to debounce a function
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function Dashboard() {
  const { classData, loading, dataLoaded, refreshData } = useData() || {};

  // Memoized and debounced refreshData to prevent excessive API calls
  const debouncedRefreshData = useCallback(
    debounce(() => {
      if (dataLoaded && refreshData) {
        refreshData();
      }
    }, 1000), // 1-second debounce
    [dataLoaded, refreshData]
  );

  // Only trigger refreshData when the component mounts and data is not loaded
  useEffect(() => {
    if (!dataLoaded && !loading && debouncedRefreshData) {
      debouncedRefreshData();
    }
  }, [dataLoaded, loading, debouncedRefreshData]);

  // Chart data with fallback to prevent errors
  const performanceData = {
    labels: classData?.subjects || ['Math', 'Science', 'English', 'History', 'Arts'],
    datasets: [
      {
        label: 'Class Average',
        data: classData?.averages || [75, 82, 79, 86, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Top Performer',
        data: classData?.topScores || [95, 92, 88, 94, 97],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {dataLoaded ? `Last updated: ${new Date().toLocaleString()}` : 'No data loaded'}
        </div>
      </div>

      <WelcomeCard />

      {dataLoaded && !loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Students"
              value={classData?.totalStudents || 0}
              icon={FiUsers}
              color="primary"
            />
            <StatsCard
              title="Average Score"
              value={classData?.overallAverage?.toFixed(1) || '0.0'}
              previousValue={classData?.previousAverage || null}
              icon={FiTrendingUp}
              color="secondary"
            />
            <StatsCard
              title="Top Performer"
              value={classData?.topPerformer || 'N/A'}
              icon={FiAward}
              color="accent"
            />
            <StatsCard
              title="At Risk Students"
              value={classData?.atRiskCount || 0}
              icon={FiAlertCircle}
              color="error"
            />
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h2>
            <PerformanceChart data={performanceData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Distribution</h2>
              <PerformanceChart
                data={{
                  labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'],
                  datasets: [
                    {
                      label: 'Students',
                      data: classData?.gradeDistribution || [5, 10, 15, 8, 2],
                      backgroundColor: [
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                type="bar"
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject Performance</h2>
              <PerformanceChart
                data={{
                  labels: classData?.subjects || ['Math', 'Science', 'English', 'History', 'Arts'],
                  datasets: [
                    {
                      label: 'Average Score',
                      data: classData?.averages || [75, 82, 79, 86, 90],
                      backgroundColor: 'rgba(124, 58, 237, 0.7)',
                      borderWidth: 1,
                    },
                  ],
                }}
                type="bar"
              />
            </div>
          </div>
        </>
      ) : null}

      {!dataLoaded && !loading ? (
        <div className="card bg-gray-50 border border-gray-200">
          <div className="text-center py-8">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Data Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV/Excel file or generate random data to get started.
            </p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;