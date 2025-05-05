import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

// Register ChartJS components
Chart.register(...registerables)

function PerformanceChart({ data, type = 'line', height = 300 }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    
    const config = {
      type,
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            bodyFont: {
              size: 14,
            },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
      },
    }

    chartInstance.current = new Chart(ctx, config)

    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default PerformanceChart