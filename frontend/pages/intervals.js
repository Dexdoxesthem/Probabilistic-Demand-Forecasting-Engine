import Head from 'next/head'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'

// Mock calibration data
const calibrationData = [
  { nominal: 10, MAPIE: 12, Prophet: 8, TFT: 11 },
  { nominal: 20, MAPIE: 21, Prophet: 15, TFT: 22 },
  { nominal: 30, MAPIE: 32, Prophet: 24, TFT: 31 },
  { nominal: 40, MAPIE: 41, Prophet: 32, TFT: 43 },
  { nominal: 50, MAPIE: 52, Prophet: 41, TFT: 50 },
  { nominal: 60, MAPIE: 60, Prophet: 50, TFT: 61 },
  { nominal: 70, MAPIE: 71, Prophet: 62, TFT: 70 },
  { nominal: 80, MAPIE: 80.5, Prophet: 73, TFT: 79.2 },
  { nominal: 90, MAPIE: 91, Prophet: 82, TFT: 89 },
  { nominal: 95, MAPIE: 94.5, Prophet: 88, TFT: 94 },
]

export default function Intervals() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <Head><title>Interval Calibration - M5 Forecasting</title></Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Overview</Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">Interval Calibration (Reliability Diagram)</h1>
        <p className="text-gray-600 mb-8">
          A reliability diagram plotting the <strong>Nominal Coverage</strong> (what the model promised) against the 
          <strong> Empirical Coverage</strong> (how often the true value actually fell within the interval out-of-sample). 
          Closer to the diagonal line is better.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-6">Coverage Reliability</h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={calibrationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis 
                  dataKey="nominal" 
                  type="number" 
                  domain={[0, 100]} 
                  label={{ value: 'Nominal Coverage Level (%)', position: 'bottom', offset: 0 }} 
                />
                <YAxis 
                  type="number" 
                  domain={[0, 100]} 
                  label={{ value: 'Empirical Coverage (%)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                
                {/* Perfect Calibration Line */}
                <Line 
                  type="linear" 
                  dataKey="nominal" 
                  name="Perfect Calibration" 
                  stroke="#111827" 
                  strokeDasharray="5 5"
                  dot={false}
                  strokeWidth={2}
                />
                
                <Line type="monotone" dataKey="MAPIE" name="LightGBM + MAPIE (EnbPI)" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="TFT" name="TFT (Native Quantiles)" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="Prophet" name="Prophet (MCMC)" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 border rounded">
              <h3 className="font-bold">MAPIE (EnbPI)</h3>
              <p className="text-sm mt-2 text-gray-600">
                Shows excellent calibration across all quantiles because it is distribution-free and specifically handles time-series dependencies.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border rounded">
              <h3 className="font-bold">TFT</h3>
              <p className="text-sm mt-2 text-gray-600">
                Native quantile regression loss produces well-calibrated intervals, occasionally under-covering at the extremes.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border rounded">
              <h3 className="font-bold">Prophet</h3>
              <p className="text-sm mt-2 text-gray-600">
                Tends to be under-calibrated (intervals are too narrow) on the highly erratic retail data, resulting in empirical coverage falling short of the nominal target.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
