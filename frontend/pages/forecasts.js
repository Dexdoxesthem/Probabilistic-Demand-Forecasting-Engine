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
  let baseSales = 20
  for (let i = 1; i <= 28; i++) {
    const isWeekend = (i % 7 === 6 || i % 7 === 0)
    baseSales = isWeekend ? baseSales * 1.5 : baseSales * 0.9
    const noise = (Math.random() - 0.5) * 5
    const actual = i <= 21 ? Math.max(0, Math.floor(baseSales + noise)) : null
    const forecast = Math.max(0, Math.floor(baseSales + noise + 2))
    
    data.push({
      day: `Day ${i}`,
      actual: actual,
      forecast: i >= 21 ? forecast : null,
      lower_80: i >= 21 ? forecast * 0.8 : null,
      upper_80: i >= 21 ? forecast * 1.2 : null,
      lower_95: i >= 21 ? forecast * 0.6 : null,
      upper_95: i >= 21 ? forecast * 1.4 : null,
    })
  }
  return data
}

export default function Forecasts() {
  const [data] = useState(generateMockData())

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <Head><title>Forecasts - M5 Forecasting</title></Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Overview</Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">Forecast Explorer</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex gap-4 mb-4">
            <select className="border p-2 rounded">
              <option>SKU: HOBBIES_1_001</option>
              <option>SKU: FOODS_3_827</option>
            </select>
            <select className="border p-2 rounded">
              <option>Model: LightGBM (MAPIE)</option>
              <option>Model: Prophet</option>
              <option>Model: SARIMA</option>
              <option>Model: TFT</option>
            </select>
          </div>
          
          <div className="h-[500px] w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* 95% Confidence Interval */}
                <Area 
                  type="monotone" 
                  dataKey="upper_95" 
                  stroke="none" 
                  fill="#e0e7ff" 
                  fillOpacity={0.5} 
                  name="95% CI (Upper)"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower_95" 
                  stroke="none" 
                  fill="#ffffff" 
                  fillOpacity={1} 
                  name="95% CI (Lower)"
                />
                
                {/* 80% Confidence Interval */}
                <Area 
                  type="monotone" 
                  dataKey="upper_80" 
                  stroke="none" 
                  fill="#c7d2fe" 
                  fillOpacity={0.7} 
                  name="80% CI (Upper)"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower_80" 
                  stroke="none" 
                  fill="#ffffff" 
                  fillOpacity={1} 
                  name="80% CI (Lower)"
                />

                {/* Point Forecast */}
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#4f46e5" 
                  fill="none" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  name="Point Forecast"
                />
                
                {/* Actual Sales */}
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#111827" 
                  fill="none" 
                  strokeWidth={2} 
                  name="Actual Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4 italic text-center">
            * Note: Displaying mock data for structural demonstration. Connect to Python backend output for live data.
          </p>
        </div>
      </div>
    </div>
  )
}
