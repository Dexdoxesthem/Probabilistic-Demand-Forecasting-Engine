import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const models = [
    { name: 'Naïve', mase: '1.00', crps: 'N/A', coverage80: 'N/A', width80: 'N/A', dmSig: '-' },
    { name: 'Seasonal Naïve', mase: '0.85', crps: 'N/A', coverage80: 'N/A', width80: 'N/A', dmSig: '-' },
    { name: 'SARIMA (Base)', mase: '0.78', crps: '0.45', coverage80: '78%', width80: '12.4', dmSig: 'Yes (vs SNaive)' },
    { name: 'Prophet', mase: '0.80', crps: '0.48', coverage80: '82%', width80: '15.1', dmSig: 'No (vs SARIMA)' },
    { name: 'Prophet + Regressors', mase: '0.72', crps: '0.41', coverage80: '81%', width80: '13.8', dmSig: 'Yes (vs Base Prophet)' },
    { name: 'LightGBM (MAPIE)', mase: '0.65', crps: '0.35', coverage80: '80.5%', width80: '10.2', dmSig: 'Yes (vs Prophet)' },
    { name: 'TFT (Deep Learning)', mase: '0.62', crps: '0.32', coverage80: '79.2%', width80: '9.8', dmSig: 'No (vs LightGBM)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <Head>
        <title>M5 Demand Forecasting Engine</title>
      </Head>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Probabilistic Demand Forecasting Engine</h1>
        <p className="text-gray-600 mb-8">Walmart M5 Competition - Store CA_1</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/forecasts" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Forecast Explorer &rarr;</h2>
            <p className="text-sm text-gray-500">Interactive SKU-level point & probabilistic forecasts.</p>
          </Link>
          <Link href="/diagnostics" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Diagnostics &rarr;</h2>
            <p className="text-sm text-gray-500">Stationarity, Seasonality, and Distributions.</p>
          </Link>
          <Link href="/intervals" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Interval Calibration &rarr;</h2>
            <p className="text-sm text-gray-500">MAPIE vs Prophet vs TFT Coverage.</p>
          </Link>
          <Link href="/methodology" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Methodology &rarr;</h2>
            <p className="text-sm text-gray-500">Walk-forward validation, CRPS, DM Tests.</p>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Model Performance Summary (Mock Data)</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MASE (Point)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRPS (Prob)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">80% Coverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval Width</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DM Significant?</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((m, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.mase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.crps}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.coverage80}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.width80}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.dmSig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
