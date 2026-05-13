"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Simulator() {
  const [totalSupply, setTotalSupply] = useState(1000000000);
  const [initPrice, setInitPrice] = useState(0.10);
  const [mintRate, setMintRate] = useState(5);
  const [burnRate, setBurnRate] = useState(2);
  const [vestPct, setVestPct] = useState(40);
  const [growthRate, setGrowthRate] = useState(15);
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  const fmt = (n) => {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  };
  const fmtN = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.round(n).toLocaleString();
  };

  const simulate = () => {
    const labels = [];
    const circ = [], burned = [], prices = [], mcaps = [];
    let supply = totalSupply * (1 - vestPct / 100);
    let totalBurned = 0;
    let price = initPrice;
    for (let y = 0; y <= 5; y++) {
      labels.push('Year ' + y);
      circ.push(Math.round(supply));
      burned.push(Math.round(totalBurned));
      prices.push(+price.toFixed(4));
      mcaps.push(Math.round(supply * price));
      supply = supply + supply * (mintRate / 100) - supply * (burnRate / 100);
      totalBurned += supply * (burnRate / 100);
      price = price * (1 + growthRate / 100);
    }
    return { labels, circ, burned, prices, mcaps };
  };

  const sim = simulate();
  const inflation = (mintRate - burnRate).toFixed(1);
  const mcapNow = sim.circ[0] * initPrice;
  const mcap5 = sim.mcaps[5];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const load = () => {
      if (!window.Chart) return setTimeout(load, 100);
      if (chartInst.current) chartInst.current.destroy();
      chartInst.current = new window.Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: sim.labels,
          datasets: [
            { label: 'Circulating', data: sim.circ, borderColor: '#00ff94', backgroundColor: 'rgba(0,255,148,0.05)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#00ff94' },
            { label: 'Burned', data: sim.burned, borderColor: '#ff4d4d', backgroundColor: 'rgba(255,77,77,0.05)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#ff4d4d' },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#555', font: { family: 'Space Mono' } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#555', font: { family: 'Space Mono', size: 10 }, callback: (v) => fmtN(v) } }
          }
        }
      });
    };
    load();
  }, [totalSupply, initPrice, mintRate, burnRate, vestPct, growthRate]);

  const sliders = [
    { label: 'Total Supply', value: totalSupply, set: setTotalSupply, min: 100000000, max: 10000000000, step: 100000000, display: fmtN(totalSupply) },
    { label: 'Initial Price (USD)', value: initPrice * 100, set: (v) => setInitPrice(v / 100), min: 1, max: 500, step: 1, display: '$' + initPrice.toFixed(2) },
    { label: 'Annual Mint Rate', value: mintRate, set: setMintRate, min: 0, max: 30, step: 1, display: mintRate + '%' },
    { label: 'Annual Burn Rate', value: burnRate, set: setBurnRate, min: 0, max: 20, step: 1, display: burnRate + '%' },
    { label: 'Vesting Lock %', value: vestPct, set: setVestPct, min: 0, max: 80, step: 5, display: vestPct + '%' },
    { label: 'Annual Price Growth', value: growthRate, set: setGrowthRate, min: -20, max: 200, step: 5, display: growthRate + '%' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--dark)', color: '#fff' }}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" async />

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 60px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="mono" style={{ color: 'var(--green)', fontSize: '14px', textDecoration: 'none' }}>← ROCKSTAR</Link>
        <span className="mono" style={{ color: '#555', fontSize: '12px', letterSpacing: '0.15em' }}>TOKEN ECONOMICS SIMULATOR</span>
      </nav>

      <div style={{ padding: '60px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '48px' }}>
          <p className="mono" style={{ color: 'var(--green)', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>DEFI TOOL</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '12px' }}>Token Economics Simulator</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>Model your token supply, burn mechanics, and 5-year market cap projection.</p>
        </div>

        {/* METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: 'var(--border)', marginBottom: '48px' }}>
          {[
            { label: 'Market Cap Now', value: fmt(mcapNow) },
            { label: 'Market Cap (5Y)', value: fmt(mcap5), highlight: mcap5 > mcapNow },
            { label: 'Inflation Rate', value: (parseFloat(inflation) >= 0 ? '+' : '') + inflation + '%', highlight: parseFloat(inflation) < 0, danger: parseFloat(inflation) > 5 },
            { label: 'Circ. Supply (5Y)', value: fmtN(sim.circ[5]) },
          ].map((m, i) => (
            <div key={i} style={{ backgroundColor: 'var(--card)', padding: '28px 32px' }}>
              <div className="mono" style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', marginBottom: '10px' }}>{m.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: m.danger ? '#ff4d4d' : m.highlight ? 'var(--green)' : '#fff' }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

          {/* CHART */}
          <div style={{ backgroundColor: 'var(--card)', padding: '32px', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00ff94' }} />Circulating
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff4d4d' }} />Burned
              </div>
            </div>
            <div style={{ position: 'relative', height: '320px' }}>
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sliders.map((s, i) => (
              <div key={i} style={{ backgroundColor: 'var(--card)', padding: '20px 24px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>{s.label}</span>
                  <span className="mono" style={{ fontSize: '13px', color: 'var(--green)', fontWeight: '700' }}>{s.display}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green)' }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}