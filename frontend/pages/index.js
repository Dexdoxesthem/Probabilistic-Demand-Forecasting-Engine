import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const models = [
    { name: 'Naïve', mase: '1.00', crps: 'N/A', coverage80: 'N/A', width80: 'N/A', dmSig: '-' },
    { name: 'SNaïve', mase: '0.85', crps: 'N/A', coverage80: 'N/A', width80: 'N/A', dmSig: '-' },
    { name: 'SARIMA', mase: '0.78', crps: '0.45', coverage80: '78.0%', width80: '12.4', dmSig: 'YES' },
    { name: 'Prophet', mase: '0.80', crps: '0.48', coverage80: '82.0%', width80: '15.1', dmSig: 'NO' },
    { name: 'LGBM+MAPIE', mase: '0.65', crps: '0.35', coverage80: '80.5%', width80: '10.2', dmSig: 'YES' },
    { name: 'TFT (DL)', mase: '0.62', crps: '0.32', coverage80: '79.2%', width80: '09.8', dmSig: 'YES' },
  ];

  const assets = [
    { ticker: 'NQ=F', last: '17,845.25', chg: '+1.2%', vol: 'High', status: 'ACTIVE' },
    { ticker: 'ES=F', last: '5,104.50', chg: '+0.8%', vol: 'Med', status: 'ACTIVE' },
    { ticker: 'EURUSD=X', last: '1.0845', chg: '-0.1%', vol: 'Low', status: 'ACTIVE' },
    { ticker: 'GC=F', last: '2,045.10', chg: '+0.4%', vol: 'Med', status: 'ACTIVE' },
  ];

  return (
    <div className="min-h-screen bg-black text-amber-500 font-mono p-4 selection:bg-amber-500 selection:text-black">
      <Head>
        <title>TERMINAL // PROBABILISTIC ENGINE</title>
      </Head>

      <main className="max-w-screen-2xl mx-auto flex flex-col gap-4">
        
        {/* HEADER */}
        <header className="border-b-2 border-amber-500 pb-2 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-glow-orange">PRB_FCST_ENG v2.0</h1>
            <p className="text-xs text-amber-700">SYS_ID: 994-Alpha | LOC: US-EAST | MS_DELAY: 14ms</p>
          </div>
          <div className="text-right text-xs">
            <p>17-SEP-2026 03:18:00 EST</p>
            <p className="text-green-500 text-glow-green">MARKET: OPEN</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
          
          {/* LEFT SIDEBAR - ASSETS & NAVIGATION */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            
            {/* NAV MENU */}
            <div className="border border-amber-900 bg-neutral-950 p-4 border-glow">
              <h2 className="text-sm font-bold border-b border-amber-900 mb-2 pb-1">COMMAND_MENU</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/forecasts" className="hover:bg-amber-900 hover:text-white px-2 py-1 block transition-colors">
                    [1] &gt; FORECAST_EXPLORER
                  </Link>
                </li>
                <li>
                  <Link href="/diagnostics" className="hover:bg-amber-900 hover:text-white px-2 py-1 block transition-colors">
                    [2] &gt; SYSTEM_DIAGNOSTICS
                  </Link>
                </li>
                <li>
                  <Link href="/intervals" className="hover:bg-amber-900 hover:text-white px-2 py-1 block transition-colors">
                    [3] &gt; CALIBRATION_MATRIX
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="hover:bg-amber-900 hover:text-white px-2 py-1 block transition-colors">
                    [4] &gt; ALGO_METHODOLOGY
                  </Link>
                </li>
              </ul>
            </div>

            {/* PROP FIRM ASSETS TRACKER */}
            <div className="border border-amber-900 bg-neutral-950 p-4 border-glow flex-grow">
              <h2 className="text-sm font-bold border-b border-amber-900 mb-2 pb-1">ACTIVE_ASSETS (PROP_FIRM)</h2>
              <div className="space-y-3">
                {assets.map((asset, i) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-neutral-800 pb-1">
                    <span className="font-bold text-white">{asset.ticker}</span>
                    <div className="text-right">
                      <span className="block">{asset.last}</span>
                      <span className={asset.chg.startsWith('+') ? 'text-green-500 text-glow-green' : 'text-red-500 text-glow-red'}>
                        {asset.chg}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-amber-700 mt-4 animate-pulse">Scanning live data feed...</p>
            </div>
          </div>

          {/* MAIN DATAGRID */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* ALERTS TICKER */}
            <div className="bg-neutral-900 border border-amber-700 p-2 text-xs flex gap-4 overflow-hidden whitespace-nowrap">
              <span className="bg-amber-500 text-black font-bold px-2">SYS_ALERT</span>
              <span className="animate-[marquee_20s_linear_infinite] inline-block">
                TFT MODEL TRAINING COMPLETE. CRPS IMPROVED BY 0.03. || EURUSD VOLATILITY SPIKE DETECTED. || MAPIE ENBPI CALIBRATION AT 99%. 
              </span>
            </div>

            {/* PERFORMANCE MATRIX */}
            <div className="border border-amber-900 bg-neutral-950 p-1 flex-grow border-glow">
              <div className="bg-amber-900 text-white text-xs font-bold p-1 px-2 mb-2 uppercase">
                Aggregated Model Performance Matrix (Out-Of-Sample)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-amber-800 text-amber-600">
                      <th className="p-2 whitespace-nowrap">ALGO_ID</th>
                      <th className="p-2 whitespace-nowrap text-right">MASE</th>
                      <th className="p-2 whitespace-nowrap text-right">CRPS</th>
                      <th className="p-2 whitespace-nowrap text-right">COV_80</th>
                      <th className="p-2 whitespace-nowrap text-right">WID_80</th>
                      <th className="p-2 whitespace-nowrap text-center">DM_SIG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((m, idx) => (
                      <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-900 transition-colors">
                        <td className="p-2 font-bold text-white">{m.name}</td>
                        <td className="p-2 text-right">{m.mase}</td>
                        <td className="p-2 text-right">{m.crps}</td>
                        <td className="p-2 text-right">{m.coverage80}</td>
                        <td className="p-2 text-right">{m.width80}</td>
                        <td className="p-2 text-center">
                          <span className={
                            m.dmSig === 'YES' ? 'bg-green-900 text-green-400 px-2 py-0.5' : 
                            m.dmSig === 'NO' ? 'bg-red-900 text-red-400 px-2 py-0.5' : 'text-neutral-500'
                          }>
                            {m.dmSig}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TERMINAL LOG OUTPUT */}
            <div className="border border-amber-900 bg-neutral-950 p-2 h-40 overflow-y-auto font-mono text-xs border-glow flex flex-col justify-end">
              <p className="text-neutral-500">Loading historical matrices...</p>
              <p className="text-neutral-500">Initializing DuckDB engine... OK</p>
              <p className="text-neutral-500">Cross-validating TFT weights... OK</p>
              <p className="text-neutral-500">Checking yfinance API connection... OK</p>
              <p className="text-green-500">&gt; SYSTEM ONLINE AND READY FOR INPUT.</p>
              <p className="text-amber-500 animate-pulse mt-1">_</p>
            </div>

          </div>
        </div>
      </main>

      {/* Tailwind Marquee Hack */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  )
}
