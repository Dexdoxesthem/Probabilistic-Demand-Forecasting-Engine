import Head from 'next/head'
import Link from 'next/link'

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <Head><title>Methodology - M5 Forecasting</title></Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Overview</Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">Methodology</h1>
        
        <div className="bg-white p-8 rounded-lg shadow space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Walk-Forward Evaluation</h2>
            <p className="text-gray-700 leading-relaxed">
              Standard cross-validation (like K-Fold) is invalid for time series because it leaks future information 
              into the past. This project exclusively uses <strong>Walk-Forward Evaluation</strong> (also known as rolling-origin evaluation). 
              The training window expands chronologically, and the model is evaluated on a strictly out-of-sample 28-day horizon 
              mimicking the official M5 competition parameters (days 1914 to 1941).
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Continuous Ranked Probability Score (CRPS)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike RMSE which penalizes point forecast errors, CRPS evaluates the entire probability distribution 
              predicted by the model. 
            </p>
            <div className="bg-gray-100 p-4 rounded border font-mono text-sm text-center">
              CRPS(F, y) = ∫ [ F(x) - H(x - y) ]² dx
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              A model that predicts a tight, accurate distribution scores better than a model that predicts 
              the correct mean but with high uncertainty. Lower CRPS is better.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Diebold-Mariano Test</h2>
            <p className="text-gray-700 leading-relaxed">
              It is common in forecasting for a complex Machine Learning model to achieve a lower error metric than a simple 
              baseline (like Seasonal Naïve), but for that difference to be purely due to random variance in the test set. 
              The <strong>Diebold-Mariano (DM) test</strong> formally tests the null hypothesis that the two forecasts have the same accuracy. 
              We report the significance of the DM test comparing our advanced models against the Seasonal Naïve baseline.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Conformal Prediction (MAPIE)</h2>
            <p className="text-gray-700 leading-relaxed">
              Tree-based models like LightGBM do not natively produce probability distributions. To generate the 80% and 95% 
              prediction intervals required for this project, we wrapped LightGBM in <strong>MAPIE</strong> (Model Agnostic Prediction Interval Estimator). 
              Specifically, we use the `EnbPI` (Ensemble Batch Prediction Intervals) method, which relaxes the exchangeability (i.i.d.) 
              assumption, making it theoretically sound for time-series data.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
