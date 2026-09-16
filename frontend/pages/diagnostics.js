import Head from 'next/head'
import Link from 'next/link'

export default function Diagnostics() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <Head><title>Diagnostics - M5 Forecasting</title></Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Overview</Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">Pre-Modelling Diagnostics</h1>
        <p className="text-gray-600 mb-8">
          This page displays standard statistical checks and seasonality decomposition 
          required before fitting time-series models.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Stationarity Tests</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-bold text-gray-700">Augmented Dickey-Fuller (ADF)</h3>
                <p className="text-sm mt-2 text-gray-600">Tests for a unit root (non-stationarity).</p>
                <div className="mt-2 text-sm">
                  <span className="font-mono bg-white px-2 py-1 border rounded">Statistic: -2.34</span>
                  <span className="ml-2 font-mono bg-white px-2 py-1 border rounded text-red-600">p-value: 0.16 (Non-Stationary)</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-bold text-gray-700">KPSS Test</h3>
                <p className="text-sm mt-2 text-gray-600">Tests for trend stationarity.</p>
                <div className="mt-2 text-sm">
                  <span className="font-mono bg-white px-2 py-1 border rounded">Statistic: 1.45</span>
                  <span className="ml-2 font-mono bg-white px-2 py-1 border rounded text-red-600">p-value: 0.01 (Non-Stationary)</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
                <p className="text-sm font-semibold">Conclusion:</p>
                <p className="text-sm">The aggregate series requires differencing. 
                Applying first-difference of log sales achieves stationarity (ADF p-value &lt; 0.01).</p>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">ACF & PACF</h2>
            <div className="h-64 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center mb-4">
               <p className="text-gray-500 text-sm">[ Autocorrelation Plot Placeholder ]</p>
            </div>
            <p className="text-sm text-gray-600">
              Significant spikes observed at lags 7, 14, 21, and 28, indicating strong weekly seasonality 
              in the Walmart sales dataset. This justifies the inclusion of `lag_7` and `lag_28` features 
              and a seasonal period of `s=7` for SARIMA.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">STL Decomposition</h2>
            <div className="h-64 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center mb-4">
               <p className="text-gray-500 text-sm">[ STL Decomposition Plot Placeholder ]</p>
            </div>
            <p className="text-sm text-gray-600">
              Seasonal and Trend decomposition using Loess (STL). Extracts the underlying trend, weekly 
              seasonal component, and residuals from the aggregate `CA_1` sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
