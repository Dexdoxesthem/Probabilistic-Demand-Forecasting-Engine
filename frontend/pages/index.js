import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const assets = [
    { ticker: 'NQ=F', name: 'Nasdaq 100', last: '17,845.25', chg: '+1.2%', chgNum: '+211.50', up: true, pred: 'BULLISH' },
    { ticker: 'ES=F', name: 'S&P 500', last: '5,104.50', chg: '+0.8%', chgNum: '+40.83', up: true, pred: 'NEUTRAL' },
    { ticker: 'EURUSD=X', name: 'Euro / US Dollar', last: '1.0845', chg: '-0.1%', chgNum: '-0.0010', up: false, pred: 'BEARISH' },
    { ticker: 'GC=F', name: 'Gold', last: '2,045.10', chg: '+0.4%', chgNum: '+8.10', up: true, pred: 'BULLISH' },
  ];

  const models = [
    { name: 'ARIMA-GARCH', role: 'Volatility', mase: '0.82', crps: '0.45', coverage: '78.0%', status: 'Active' },
    { name: 'LightGBM (EnbPI)', role: 'Directional', mase: '0.65', crps: '0.35', coverage: '80.5%', status: 'Active' },
    { name: 'Temporal Fusion Transformer', role: 'Portfolio Regime', mase: '0.62', crps: '0.32', coverage: '79.2%', status: 'Active' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Head>
        <title>Prop Firm Quantitative Engine</title>
      </Head>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Quantitative Trading Engine
            </h1>
            <p className="text-gray-400 mt-1">Regime-aware probabilistic forecasting for Prop Firm assets.</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            System Online
          </div>
        </header>

        {/* Financial Assets Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Tracked Challenge Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assets.map((asset, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{asset.ticker}</h3>
                    <p className="text-xs text-gray-500">{asset.name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    asset.pred === 'BULLISH' ? 'bg-green-500/10 text-green-400' :
                    asset.pred === 'BEARISH' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {asset.pred}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-semibold">{asset.last}</p>
                  <p className={`text-sm flex gap-2 ${asset.up ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{asset.chgNum}</span>
                    <span>({asset.chg})</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Navigation */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/forecasts" className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Forecast Explorer</h2>
              <p className="text-gray-400 text-sm">Interactive OHLCV charts with conformal prediction intervals and regime highlighting.</p>
            </Link>
            
            <Link href="/intervals" className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
              <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Risk Calibration</h2>
              <p className="text-gray-400 text-sm">Analyze MAPIE and TFT interval coverage to assess Value-at-Risk (VaR) accuracy.</p>
            </Link>
          </div>
        </section>

        {/* Model Infrastructure */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Active Architecture</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/50 border-b border-gray-800 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Engine / Model</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium text-right">MASE</th>
                    <th className="px-6 py-4 font-medium text-right">CRPS</th>
                    <th className="px-6 py-4 font-medium text-right">Coverage Target</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {models.map((m, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-semibold">{m.name}</td>
                      <td className="px-6 py-4 text-gray-400">{m.role}</td>
                      <td className="px-6 py-4 text-right text-gray-300">{m.mase}</td>
                      <td className="px-6 py-4 text-right text-gray-300">{m.crps}</td>
                      <td className="px-6 py-4 text-right text-gray-300">{m.coverage}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
