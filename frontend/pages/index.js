import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  
  useEffect(() => {
    // Ported from the raw HTML script tag
    var cards = document.querySelectorAll('.asset');
    function select(el){
      cards.forEach(function(c){ c.setAttribute('aria-selected', c === el ? 'true' : 'false'); });
    }
    cards.forEach(function(c){
      c.addEventListener('click', function(){ select(c); });
      c.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(c); }
      });
    });
  }, [])

  return (
    <>
      <Head>
        <title>Forecast Engine — Prop Firm Console</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: `
<div class="shell">
  <aside class="rail">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 12.5 5 7l3 3 6-8.5" stroke="#04201B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div><b>Forecast Engine</b><span>Prop firm console</span></div>
    </div>

    <nav class="nav" aria-label="Sections">
      <h4>Trading</h4>
      <a href="#" aria-current="page"><i class="dot"></i>Challenge status</a>
      <a href="#assets"><i class="dot"></i>Instruments</a>
      <a href="#calibration"><i class="dot"></i>Forecast quality</a>
      <a href="#models"><i class="dot"></i>Model bench</a>
      <h4>Research</h4>
      <a href="#"><i class="dot"></i>Backtests</a>
      <a href="#"><i class="dot"></i>Feature store</a>
      <a href="#"><i class="dot"></i>Run history</a>
    </nav>

    <div class="rail-foot">
      <div class="acct">
        <div class="avatar">SP</div>
        <div><b style="font-size:12.5px">Shaswata</b><small>Evaluation · 100K</small></div>
      </div>
    </div>
  </aside>

  <main>
    <div class="topbar">
      <div class="crumb">Challenge <b>#A-2211</b> · day 14 of 30</div>
      <div class="spacer"></div>
      <span class="pill live">Models fresh · 06:12 ago</span>
      <button class="btn">Export run</button>
      <button class="btn btn-primary">Re-run forecast</button>
    </div>

    <div class="warnbar">
      <span aria-hidden="true">⚠</span>
      <div><b>Demo data.</b> Numbers below are a sample payload so layout and states can be reviewed — wire to the engine's forecast artifact before reading anything into them.</div>
    </div>

    <section class="grid hero" style="margin-bottom:16px">
      <div class="panel hero-main">
        <div class="head-row">
          <div>
            <h3>Probability of passing this challenge</h3>
            <p>10,000 Monte Carlo paths drawn from the current predictive distributions, run against the firm's daily-loss, drawdown and profit-target rules.</p>
          </div>
        </div>

        <div class="pass-readout">
          <div class="pass-num">68.4%</div>
          <div class="pass-meta">
            <div><span class="delta">+4.1 pts</span> since last re-fit</div>
            <small>Median finish +6.8% · 5th pct −3.1%</small>
          </div>
        </div>

        <div class="fan-wrap">
          <svg viewBox="0 0 880 300" role="img" aria-label="Equity fan chart: median path with 50, 80 and 95 percent bands across 30 trading days">
            <defs>
              <linearGradient id="g95" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#2EE6B6" stop-opacity=".16"/>
                <stop offset="1" stop-color="#2EE6B6" stop-opacity=".03"/>
              </linearGradient>
              <linearGradient id="g80" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#2EE6B6" stop-opacity=".26"/>
                <stop offset="1" stop-color="#2EE6B6" stop-opacity=".07"/>
              </linearGradient>
              <linearGradient id="g50" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#2EE6B6" stop-opacity=".40"/>
                <stop offset="1" stop-color="#2EE6B6" stop-opacity=".16"/>
              </linearGradient>
            </defs>
            <g stroke="rgba(120,180,175,.10)" stroke-width="1">
              <line x1="52" y1="40" x2="856" y2="40"/>
              <line x1="52" y1="95" x2="856" y2="95"/>
              <line x1="52" y1="150" x2="856" y2="150"/>
              <line x1="52" y1="205" x2="856" y2="205"/>
              <line x1="52" y1="260" x2="856" y2="260"/>
            </g>
            <g fill="#5E7273" font-size="10.5" font-family="JetBrains Mono, monospace">
              <text x="6" y="44">+12%</text><text x="6" y="99">+8%</text>
              <text x="6" y="154">+4%</text><text x="10" y="209">0%</text>
              <text x="6" y="264">−4%</text>
            </g>
            <line x1="52" y1="95" x2="856" y2="95" stroke="#9B7BFF" stroke-width="1.4" stroke-dasharray="5 5" opacity=".75"/>
            <text x="770" y="88" fill="#9B7BFF" font-size="10.5" font-family="Manrope">Profit target +8%</text>
            <line x1="52" y1="268" x2="856" y2="268" stroke="#FF6B8A" stroke-width="1.4" stroke-dasharray="5 5" opacity=".7"/>
            <text x="742" y="284" fill="#FF6B8A" font-size="10.5" font-family="Manrope">Max drawdown −5%</text>
            <path fill="url(#g95)" d="M362,205 C470,180 560,138 650,100 C720,70 790,48 856,34 L856,286 C790,272 720,258 650,244 C560,226 470,216 362,205 Z"/>
            <path fill="url(#g80)" d="M362,205 C470,184 560,150 650,118 C720,94 790,74 856,60 L856,268 C790,256 720,244 650,230 C560,214 470,208 362,205 Z"/>
            <path fill="url(#g50)" d="M362,205 C470,192 560,168 650,144 C720,126 790,110 856,96 L856,238 C790,230 720,220 650,208 C560,196 470,200 362,205 Z"/>
            <path d="M52,238 L74,232 L96,240 L118,228 L140,231 L162,219 L184,224 L206,212 L228,216 L250,207 L272,213 L294,203 L316,209 L340,200 L362,205"
                  fill="none" stroke="#E6F2F0" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="M362,205 C470,198 560,180 650,162 C720,148 790,138 856,128"
                  fill="none" stroke="#2EE6B6" stroke-width="2.4" stroke-dasharray="1 0" stroke-linecap="round"/>
            <circle cx="362" cy="205" r="4.5" fill="#2EE6B6" stroke="#05090B" stroke-width="2"/>
            <line x1="362" y1="30" x2="362" y2="288" stroke="rgba(46,230,182,.35)" stroke-width="1" stroke-dasharray="3 4"/>
            <text x="368" y="42" fill="#8FA6A6" font-size="10.5" font-family="Manrope">today</text>
            <g fill="#5E7273" font-size="10.5" font-family="JetBrains Mono, monospace">
              <text x="52" y="298">d0</text><text x="352" y="298">d14</text><text x="600" y="298">d22</text><text x="838" y="298">d30</text>
            </g>
          </svg>
        </div>

        <div class="legend">
          <span><i style="background:#E6F2F0"></i>Realised equity</span>
          <span><i style="background:#2EE6B6"></i>Median path</span>
          <span><i style="background:rgba(46,230,182,.40)"></i>50%</span>
          <span><i style="background:rgba(46,230,182,.26)"></i>80%</span>
          <span><i style="background:rgba(46,230,182,.14)"></i>95%</span>
        </div>
      </div>

      <div class="panel">
        <div class="head-row">
          <div>
            <h3>Firm rules</h3>
            <p>Headroom left before each hard limit, and how often the simulated paths break it.</p>
          </div>
        </div>
        <div class="rules">
          <div class="rule">
            <div class="rule-top"><span>Profit target</span><b class="mono">$4,118 / $8,000</b></div>
            <div class="bar"><i class="b-teal" style="width:51.5%"></i></div>
            <small>51% of the way there · reached in 71% of paths</small>
          </div>
          <div class="rule">
            <div class="rule-top"><span>Daily loss used</span><b class="mono">$1,240 / $5,000</b></div>
            <div class="bar"><i class="b-violet" style="width:24.8%"></i></div>
            <small>Resets 00:00 UTC · breach risk today 3.2%</small>
          </div>
          <div class="rule">
            <div class="rule-top"><span>Overall drawdown</span><b class="mono">$2,310 / $10,000</b></div>
            <div class="bar"><i class="b-amber" style="width:23.1%"></i></div>
            <small>Trailing from peak · breach risk over 30d 24.4%</small>
          </div>
          <div class="rule">
            <div class="rule-top"><span>Minimum trading days</span><b class="mono">9 / 10</b></div>
            <div class="bar"><i class="b-teal" style="width:90%"></i></div>
            <small>One more active session clears this</small>
          </div>
          <div class="rule">
            <div class="rule-top"><span>Risk budget per trade</span><b class="mono">0.38% (½ Kelly)</b></div>
            <div class="bar"><i class="b-rose" style="width:38%"></i></div>
            <small>Sized from the predictive distribution, capped at 1%</small>
          </div>
        </div>
      </div>
    </section>

    <section id="assets" style="margin-bottom:16px">
      <div class="head-row">
        <div>
          <h3 style="font-size:14px;margin:0 0 3px">Instruments</h3>
          <p style="margin:0;color:var(--ink-3);font-size:12.3px">Direction is the sign of the median 1-day return forecast. Edge is median return over forecast spread — below 0.15 the signal isn't worth the spread.</p>
        </div>
      </div>
      <div class="grid assets">

        <article class="panel asset" aria-selected="true" tabindex="0">
          <div class="asset-top"><div class="tick">NQ</div><span class="tag t-long">Long</span></div>
          <div class="name">Nasdaq 100 futures</div>
          <div><span class="px">17,845.25</span><span class="chg up">+1.2%</span></div>
          <svg class="spark" viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,28 L16,25 L32,29 L48,21 L64,24 L80,17 L96,20 L112,12 L128,15 L144,8 L160,6" fill="none" stroke="#2EE6B6" stroke-width="1.8"/>
            <path d="M0,28 L16,25 L32,29 L48,21 L64,24 L80,17 L96,20 L112,12 L128,15 L144,8 L160,6 L160,36 L0,36 Z" fill="#2EE6B6" opacity=".08"/>
          </svg>
          <div class="edge"><span>Edge <b>0.31</b></span><span>σ̂ 1d <b>1.14%</b></span></div>
        </article>

        <article class="panel asset" tabindex="0">
          <div class="asset-top"><div class="tick">ES</div><span class="tag t-flat">No trade</span></div>
          <div class="name">S&amp;P 500 futures</div>
          <div><span class="px">5,104.50</span><span class="chg up">+0.8%</span></div>
          <svg class="spark" viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,22 L16,20 L32,24 L48,19 L64,23 L80,18 L96,22 L112,17 L128,21 L144,18 L160,19" fill="none" stroke="#9B7BFF" stroke-width="1.8"/>
            <path d="M0,22 L16,20 L32,24 L48,19 L64,23 L80,18 L96,22 L112,17 L128,21 L144,18 L160,19 L160,36 L0,36 Z" fill="#9B7BFF" opacity=".08"/>
          </svg>
          <div class="edge"><span>Edge <b>0.06</b></span><span>σ̂ 1d <b>0.79%</b></span></div>
        </article>

        <article class="panel asset" tabindex="0">
          <div class="asset-top"><div class="tick">EURUSD</div><span class="tag t-short">Short</span></div>
          <div class="name">Euro / US Dollar</div>
          <div><span class="px">1.08450</span><span class="chg down">−0.1%</span></div>
          <svg class="spark" viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,12 L16,15 L32,11 L48,17 L64,14 L80,20 L96,18 L112,24 L128,21 L144,27 L160,26" fill="none" stroke="#FF6B8A" stroke-width="1.8"/>
            <path d="M0,12 L16,15 L32,11 L48,17 L64,14 L80,20 L96,18 L112,24 L128,21 L144,27 L160,26 L160,36 L0,36 Z" fill="#FF6B8A" opacity=".08"/>
          </svg>
          <div class="edge"><span>Edge <b>0.22</b></span><span>σ̂ 1d <b>0.41%</b></span></div>
        </article>

        <article class="panel asset" tabindex="0">
          <div class="asset-top"><div class="tick">GC</div><span class="tag t-long">Long</span></div>
          <div class="name">Gold futures</div>
          <div><span class="px">2,045.10</span><span class="chg up">+0.4%</span></div>
          <svg class="spark" viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,26 L16,24 L32,27 L48,22 L64,25 L80,19 L96,22 L112,16 L128,18 L144,13 L160,11" fill="none" stroke="#2EE6B6" stroke-width="1.8"/>
            <path d="M0,26 L16,24 L32,27 L48,22 L64,25 L80,19 L96,22 L112,16 L128,18 L144,13 L160,11 L160,36 L0,36 Z" fill="#2EE6B6" opacity=".08"/>
          </svg>
          <div class="edge"><span>Edge <b>0.18</b></span><span>σ̂ 1d <b>0.92%</b></span></div>
        </article>

      </div>
    </section>

    <section class="grid two">
      <div class="panel" id="calibration">
        <div class="head-row">
          <div>
            <h3>Are the intervals honest?</h3>
            <p>How often the true price actually landed inside each stated band, over the last 250 walk-forward days.</p>
          </div>
        </div>
        <div class="calib">
          <svg viewBox="0 0 200 200" role="img" aria-label="Reliability diagram: observed coverage against nominal coverage, sitting slightly below the ideal line">
            <rect x="26" y="8" width="166" height="166" fill="rgba(255,255,255,.015)" stroke="rgba(120,180,175,.10)"/>
            <g stroke="rgba(120,180,175,.07)">
              <line x1="26" y1="50" x2="192" y2="50"/><line x1="26" y1="91" x2="192" y2="91"/><line x1="26" y1="132" x2="192" y2="132"/>
              <line x1="68" y1="8" x2="68" y2="174"/><line x1="109" y1="8" x2="109" y2="174"/><line x1="150" y1="8" x2="150" y2="174"/>
            </g>
            <line x1="26" y1="174" x2="192" y2="8" stroke="#5E7273" stroke-width="1.3" stroke-dasharray="4 4"/>
            <path d="M26,174 L68,142 L109,104 L150,62 L192,24" fill="none" stroke="#2EE6B6" stroke-width="2.4" stroke-linecap="round"/>
            <g fill="#2EE6B6">
              <circle cx="68" cy="142" r="3.4"/><circle cx="109" cy="104" r="3.4"/>
              <circle cx="150" cy="62" r="3.4"/><circle cx="192" cy="24" r="3.4"/>
            </g>
            <text x="26" y="192" fill="#5E7273" font-size="9.5" font-family="Manrope">nominal →</text>
            <text x="2" y="20" fill="#5E7273" font-size="9.5" font-family="Manrope">observed</text>
          </svg>
          <div class="cal-rows">
            <div class="cal-row"><span>50%</span><div class="bar"><i class="b-teal" style="width:92%"></i></div><b>46.1%</b></div>
            <div class="cal-row"><span>80%</span><div class="bar"><i class="b-teal" style="width:94%"></i></div><b>75.3%</b></div>
            <div class="cal-row"><span>90%</span><div class="bar"><i class="b-amber" style="width:91%"></i></div><b class="miss">81.8%</b></div>
            <div class="cal-row"><span>95%</span><div class="bar"><i class="b-amber" style="width:90%"></i></div><b class="miss">85.6%</b></div>
            <p style="margin:6px 0 0;font-size:11.6px;color:var(--ink-3);line-height:1.5">
              The tails are too narrow — real moves break the 95% band roughly three times as often as they should. Widen with a conformal correction before sizing off these numbers.
            </p>
          </div>
        </div>
      </div>

      <div class="panel" id="models">
        <div class="head-row">
          <div>
            <h3>Model bench</h3>
            <p>Scored against a random-walk baseline on the same walk-forward folds, with purging and a 1-day embargo.</p>
          </div>
        </div>
        <div class="wrap-x">
          <table>
            <thead>
              <tr><th>Model</th><th>Skill vs RW</th><th>CRPS</th><th>Pinball</th><th>DM p</th><th>State</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="model">ARIMA–GARCH<small>Volatility</small></td>
                <td class="num win">+9.4%</td><td class="num">0.451</td><td class="num">0.118</td><td class="num">0.008</td>
                <td><span class="chip c-on">Live</span></td>
              </tr>
              <tr>
                <td class="model">LightGBM quantile<small>Direction &amp; return</small></td>
                <td class="num win">+6.1%</td><td class="num">0.349</td><td class="num">0.094</td><td class="num">0.031</td>
                <td><span class="chip c-on">Live</span></td>
              </tr>
              <tr>
                <td class="model">HAR-RV<small>Realised vol baseline</small></td>
                <td class="num win">+4.8%</td><td class="num">0.468</td><td class="num">0.121</td><td class="num">0.044</td>
                <td><span class="chip c-on">Live</span></td>
              </tr>
              <tr>
                <td class="model">Temporal Fusion Transformer<small>Regime</small></td>
                <td class="num">+1.2%</td><td class="num">0.321</td><td class="num">0.089</td><td class="num">0.212</td>
                <td><span class="chip c-warn">Unproven</span></td>
              </tr>
              <tr>
                <td class="model">Random walk<small>Baseline</small></td>
                <td class="num" style="color:var(--ink-3)">—</td><td class="num">0.498</td><td class="num">0.129</td><td class="num" style="color:var(--ink-3)">—</td>
                <td><span class="chip c-off">Reference</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="margin:14px 0 0;font-size:11.8px;color:var(--ink-3);line-height:1.55">
          The transformer's CRPS looks best but its Diebold–Mariano p-value is 0.21 — that gap isn't distinguishable from noise on this sample. It stays out of the live ensemble until it clears 0.05.
        </p>
      </div>

    </section>

    <footer>
      <span>Run 2026-09-17 09:41 UTC · commit 7f3a91c · seed 42</span>
      <span>·</span>
      <span>Forecasts are model output, not trade advice.</span>
    </footer>
  </main>
</div>
      `}} />
    </>
  )
}
