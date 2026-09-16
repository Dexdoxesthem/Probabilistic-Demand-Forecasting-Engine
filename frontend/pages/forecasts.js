import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const generateMockData = () => {
  const data = []
  let basePrice = 17500
  for (let i = 1; i <= 28; i++) {
    const trend = i > 14 ? 1.002 : 0.998
    basePrice = basePrice * trend + (Math.random() - 0.5) * 150
    const actual = i <= 21 ? Math.floor(basePrice) : null
    const forecast = Math.floor(basePrice + 20)
    
    data.push({
      day: `T+${i}`,
      actual: actual,
      forecast: i >= 21 ? forecast : null,
      lower_80: i >= 21 ? forecast * 0.99 : null,
      upper_80: i >= 21 ? forecast * 1.01 : null,
      lower_95: i >= 21 ? forecast * 0.98 : null,
      upper_95: i >= 21 ? forecast * 1.02 : null,
    })
  }
  return data
}

export default function Forecasts() {
  const [data] = useState(generateMockData())

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Head><title>Forecasts - Prop Engine</title></Head>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forecast Explorer</h1>
          <p className="text-gray-400">Interactive OHLCV projection with conformal uncertainty bands.</p>
        </header>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <select className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>NQ=F (Nasdaq 100)</option>
              <option>ES=F (S&P 500)</option>
              <option>EURUSD=X</option>
              <option>GC=F (Gold)</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>LightGBM (MAPIE EnbPI)</option>
              <option>Temporal Fusion Transformer</option>
              <option>ARIMA-GARCH</option>
            </select>
          </div>
          
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                
                {/* 95% Confidence Interval */}
                <Area 
                  type="monotone" 
                  dataKey="upper_95" 
                  stroke="none" 
                  fill="#1e3a8a" 
                  fillOpacity={0.3} 
                  name="95% CI (Upper)"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower_95" 
                  stroke="none" 
                  fill="#111827" 
                  fillOpacity={1} 
                  name="95% CI (Lower)"
                />
                
                {/* 80% Confidence Interval */}
                <Area 
                  type="monotone" 
                  dataKey="upper_80" 
                  stroke="none" 
                  fill="#1d4ed8" 
                  fillOpacity={0.4} 
                  name="80% CI (Upper)"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower_80" 
                  stroke="none" 
                  fill="#111827" 
                  fillOpacity={1} 
                  name="80% CI (Lower)"
                />

                {/* Point Forecast */}
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#60a5fa" 
                  fill="url(#colorForecast)" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  name="Projected Price"
                />
                
                {/* Actual Sales */}
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f3f4f6" 
                  fill="none" 
                  strokeWidth={3} 
                  name="Actual Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
