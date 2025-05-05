import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

function StatsCard({ title, value, previousValue, icon, color }) {
  const Icon = icon
  const percentChange = previousValue 
    ? ((value - previousValue) / previousValue) * 100 
    : 0
  
  let TrendIcon = FiMinus
  let trendColor = 'text-gray-500'
  
  if (percentChange > 0) {
    TrendIcon = FiTrendingUp
    trendColor = 'text-success-500'
  } else if (percentChange < 0) {
    TrendIcon = FiTrendingDown
    trendColor = 'text-error-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className={`p-2 rounded-md bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-500`} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      
      {previousValue !== undefined && (
        <div className="flex items-center mt-2 text-sm">
          <TrendIcon className={`mr-1 ${trendColor}`} />
          <span className={trendColor}>
            {Math.abs(percentChange).toFixed(1)}%
          </span>
          <span className="text-gray-500 ml-1">
            vs previous
          </span>
        </div>
      )}
    </div>
  )
}

export default StatsCard