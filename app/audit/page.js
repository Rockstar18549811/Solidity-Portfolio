"use client";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Access Control",
    color: "#ff4d4d",
    items: [
      { id: "ac1", text: "Owner/admin functions are protected with modifiers", detail: "Functions like mint, pause, or upgrade should require onlyOwner or a role check." },
      { id: "ac2", text: "No sensitive function is publicly callable", detail: "Review all public/external functions and confirm none expose critical logic." },
      { id: "ac3", text: "Role-based access is properly implemented", detail: "If using OpenZeppelin AccessControl, roles must be granted and checked correctly." },
      { id: "ac4", text: "Constructor sets the correct initial owner", detail: "Ownership should be assigned to msg.sender or a specified address at deployment." },
    ]
  },
  {
    title: "Reentrancy",
    color: "#f0a500",
    items: [
      { id: "re1", text: "State is updated before external calls", detail: "Always follow the Checks-Effects-Interactions pattern to prevent reentrancy." },
      { id: "re2", text: "ReentrancyGuard is used on vulnerable functions", detail: "Use OpenZeppelin's ReentrancyGuard on functions that send ETH or call external contracts." },
      { id: "re3", text: "No recursive call paths exist", detail: "Trace all call paths to ensure no function can call back into itself." },
    ]
  },
  {
    title: "Integer Safety",
    color: "#7f77dd",
    items: [
      { id: "is1", text: "Solidity 0.8+ used or SafeMath imported", detail: "Solidity 0.8+ has built-in overflow protection. Older versions need SafeMath." },
      { id: "is2", text: "No unchecked blocks hide overflow risks", detail: "unchecked{} blocks disable overflow protection — verify they are safe to use." },
      { id: "is3", text: "Division before multiplication is avoided", detail: "Division truncates in Solidity — always multiply before dividing to preserve precision." },
    ]
  },
  {
    title: "Input Validation",
    color: "#00ff94",
    items: [
      { id: "iv1", text: "All inputs are validated with require statements", detail: "Check addresses are not zero, amounts are greater than zero, and ranges are valid." },
      { id: "iv2", text: "Zero address checks are in place", detail: "Sending tokens to address(0) burns them permanently — always check for this." },
      { id: "iv3", text: "Array lengths are bounded to prevent gas issues", detail: "Unbounded loops over arrays can exceed the gas limit and brick functions." },
    ]
  },
  {
    title: "Logic & Business Rules",
    color: "#378add",
    items: [
      { id: "lb1", text: "Token economics are correctly implemented", detail: "Verify mint, burn, and transfer logic matches the intended tokenomics design." },
      { id: "lb2", text: "Events are emitted for all state changes", detail: "Events allow off-chain systems to track on-chain changes — emit them consistently." },
      { id: "lb3", text: "No hardcoded addresses or magic numbers", detail: "Hardcoded values make contracts inflexible and error-prone — use constants or params." },
      { id: "lb4", text: "Contract handles ETH correctly if payable", detail: "Payable functions must account for ETH received, stored, and withdrawn safely." },
    ]
  },
  {
    title: "Upgradability & Deployment",
    color: "#ef9f27",
    items: [
      { id: "ud1", text: "Proxy pattern is correctly implemented if upgradeable", detail: "Upgradeable contracts using proxies must avoid storage collisions and initialize properly." },
      { id: "ud2", text: "Constructor vs initializer is used correctly", detail: "Upgradeable contracts must use initializer functions, not constructors." },
      { id: "ud3", text: "Contract is verified on block explorer", detail: "Verify source code on Etherscan so users can audit the deployed contract." },
    ]
  },
];

export default function Audit() {
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});
  const [contractName, setContractName] = useState('');

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const allItems = CATEGORIES.flatMap(c => c.items);
  const totalChecked = allItems.filter(item => checked[item.id]).length;
  const total = allItems.length;
  const percent = Math.round((totalChecked / total) * 100);

  const scoreColor = percent >= 80 ? 'var(--green)' : percent >= 60 ? '#f0a500' : '#ff4d4d';
  const scoreLabel = percent >= 80 ? 'GOOD' : percent >= 60 ? 'NEEDS WORK' : 'AT RISK';

  const reset = () => { setChecked({}); setExpanded({}); };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--dark)', color: '#fff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 60px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="mono" style={{ color: 'var(--green)', fontSize: '14px', textDecoration: 'none' }}>← ROCKSTAR</Link>
        <span className="mono" style={{ color: '#555', fontSize: '12px', letterSpacing: '0.15em' }}>SMART CONTRACT AUDIT</span>
      </nav>

      <div style={{ padding: '60px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <p className="mono" style={{ color: 'var(--green)', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>SECURITY TOOL</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '12px' }}>Audit Checklist Tool</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>Step through a professional smart contract security audit.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>

          {/* CHECKLIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Contract Name */}
            <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px', fontFamily: 'Space Mono, monospace' }}>CONTRACT NAME (OPTIONAL)</label>
              <input
                value={contractName}
                onChange={e => setContractName(e.target.value)}
                placeholder="e.g. RockstarToken.sol"
                style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontSize: '16px', padding: '8px 0', outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {CATEGORIES.map(cat => {
              const catChecked = cat.items.filter(i => checked[i.id]).length;
              return (
                <div key={cat.title} style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{cat.title}</span>
                    </div>
                    <span className="mono" style={{ fontSize: '12px', color: catChecked === cat.items.length ? 'var(--green)' : '#555' }}>
                      {catChecked}/{cat.items.length}
                    </span>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {cat.items.map(item => (
                      <div key={item.id}>
                        <div
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '14px 24px', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#161616'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div
                            onClick={() => toggle(item.id)}
                            style={{ width: '20px', height: '20px', borderRadius: '4px', border: checked[item.id] ? 'none' : '1px solid var(--border)', backgroundColor: checked[item.id] ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', cursor: 'pointer', transition: 'all 0.15s' }}>
                            {checked[item.id] && <span style={{ color: '#000', fontSize: '13px', fontWeight: '700' }}>✓</span>}
                          </div>
                          <div style={{ flex: 1 }} onClick={() => toggle(item.id)}>
                            <p style={{ fontSize: '14px', color: checked[item.id] ? '#555' : '#ccc', textDecoration: checked[item.id] ? 'line-through' : 'none', lineHeight: '1.5', transition: 'all 0.15s' }}>{item.text}</p>
                          </div>
                          <button onClick={() => toggleExpand(item.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '12px', fontFamily: 'Space Mono, monospace', flexShrink: 0 }}>
                            {expanded[item.id] ? '▲' : '▼'}
                          </button>
                        </div>
                        {expanded[item.id] && (
                          <div style={{ padding: '0 24px 16px 60px' }}>
                            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', borderLeft: `2px solid ${cat.color}`, paddingLeft: '12px' }}>{item.detail}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SCORE PANEL */}
          <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '32px 24px', textAlign: 'center' }}>
              <p className="mono" style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', marginBottom: '16px' }}>AUDIT SCORE</p>
              <div style={{ fontSize: '72px', fontWeight: '800', color: scoreColor, fontFamily: 'Space Mono, monospace', lineHeight: '1' }}>{percent}%</div>
              <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace', color: scoreColor }}>{scoreLabel}</div>
              <div style={{ marginTop: '24px', backgroundColor: 'var(--dark)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, backgroundColor: scoreColor, borderRadius: '4px', transition: 'width 0.4s ease' }} />
              </div>
              <p style={{ marginTop: '16px', fontSize: '13px', color: '#555' }}>{totalChecked} of {total} checks passed</p>
            </div>

            {/* Category breakdown */}
            <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px' }}>
              <p className="mono" style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', marginBottom: '16px' }}>BREAKDOWN</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CATEGORIES.map(cat => {
                  const catChecked = cat.items.filter(i => checked[i.id]).length;
                  const catPct = Math.round((catChecked / cat.items.length) * 100);
                  return (
                    <div key={cat.title}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>{cat.title}</span>
                        <span className="mono" style={{ fontSize: '11px', color: cat.color }}>{catPct}%</span>
                      </div>
                      <div style={{ backgroundColor: 'var(--dark)', borderRadius: '2px', height: '3px' }}>
                        <div style={{ height: '100%', width: `${catPct}%`, backgroundColor: cat.color, borderRadius: '2px', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={reset} style={{ padding: '14px', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: '#555', fontFamily: 'Space Mono, monospace', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.05em' }}>
              RESET CHECKLIST
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}