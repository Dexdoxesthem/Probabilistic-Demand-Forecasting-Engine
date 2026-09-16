import Head from 'next/head'
import Link from 'next/link'

export default function Forecasts() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
          
          <div className="h-96 bg-gray-100 flex items-center justify-center rounded border border-dashed border-gray-300">
            <p className="text-gray-500">[ Interactive Recharts Area Chart Placeholder ]</p>
            {/* In a real implementation, we'd use Recharts here mapping over JSON data from the backend */}
          </div>
        </div>
      </div>
    </div>
  )
}
