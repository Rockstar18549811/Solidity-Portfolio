"use client";
import { useState } from "react";
import Link from "next/link";

const EXAMPLE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "SimpleToken";
    string public symbol = "STK";
    uint256 public totalSupply = 1000000;
    mapping(address => uint256) public balanceOf;
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}`;

function analyzeContract(code) {
  const functions = [];
  const variables = [];
  const risks = [];

  const fnMatches = code.matchAll(/function\s+(\w+)\s*\(([^)]*)\)[^{]*/g);
  for (const match of fnMatches) {
    const name = match[1];
    let risk = 'low';
    if (/transfer|send|call|delegatecall/i.test(name)) risk = 'high';
    else if (/mint|burn|approve|withdraw/i.test(name)) risk = 'medium';
    const what = name === 'transfer' ? 'Moves tokens from one address to another'
      : name === 'mint' ? 'Creates new tokens and adds to supply'
      : name === 'burn' ? 'Destroys tokens reducing total supply'
      : name === 'approve' ? 'Allows another address to spend tokens on your behalf'
      : name === 'withdraw' ? 'Withdraws funds from the contract'
      : name === 'constructor' ? 'Runs once when contract is deployed'
      : `Executes the ${name} operation`;
    functions.push({ name, what, risk });
  }

  const varMatches = code.matchAll(/(uint256|string|address|bool|mapping)\s+(?:public\s+)?(\w+)/g);
  for (const match of varMatches) {
    const type = match[1];
    const name = match[2];
    if (['balanceOf', 'allowance', 'totalSupply', 'name', 'symbol', 'owner'].includes(name)) {
      const what = name === 'balanceOf' ? 'Tracks how many tokens each address holds'
        : name === 'totalSupply' ? 'The total number of tokens in existence'
        : name === 'name' ? 'The name of this token'
        : name === 'symbol' ? 'The short ticker symbol of this token'
        : name === 'owner' ? 'The address that owns and controls this contract'
        : name === 'allowance' ? 'Tracks spending permissions between addresses'
        : `Stores the ${name} value`;
      variables.push({ name, what });
    }
  }

  if (!code.includes('onlyOwner') && code.includes('mint')) risks.push('No access control on mint function — anyone can mint tokens');
  if (code.includes('call{value') || code.includes('.call(')) risks.push('Uses low-level call — potential reentrancy vulnerability');
  if (!code.includes('require') && !code.includes('revert')) risks.push('No input validation — missing require statements');
  if (code.includes('tx.origin')) risks.push('Uses tx.origin for authorization — phishing vulnerability');
  if (!code.includes('pragma solidity')) risks.push('No Solidity version specified — compiler version unknown');

  const isERC20 = code.includes('balanceOf') && code.includes('transfer');
  const isNFT = code.includes('tokenURI') || code.includes('ownerOf');
  const isMultisig = code.includes('confirmations') || code.includes('owners');
  const type = isNFT ? 'NFT Contract' : isERC20 ? 'ERC20 Token' : isMultisig ? 'Multisig Wallet' : 'Smart Contract';

  const score = Math.max(40, 100 - (risks.length * 15) - (functions.filter(f => f.risk === 'high').length * 5));

  const summary = `A ${type.toLowerCase()} that manages ${functions.length} function${functions.length !== 1 ? 's' : ''} and ${variables.length} state variable${variables.length !== 1 ? 's' : ''} on the blockchain.`;

  return { summary, type, functions, variables, risks, score };
}

export default function Explainer() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const explain = () => {
    if (!code.trim()) return setError('Please paste a Solidity contract first.');
    setError('');
    setResult(analyzeContract(code));
  };

  const scoreColor = result ? (result.score >= 80 ? 'var(--green)' : result.score >= 60 ? '#f0a500' : '#ff4d4d') : '#fff';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--dark)', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 60px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="mono" style={{ color: 'var(--green)', fontSize: '14px', textDecoration: 'none' }}>← ROCKSTAR</Link>
        <span className="mono" style={{ color: '#555', fontSize: '12px', letterSpacing: '0.15em' }}>SMART CONTRACT EXPLAINER</span>
      </nav>

      <div style={{ padding: '60px' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <p className="mono" style={{ color: 'var(--green)', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>ANALYSIS TOOL</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '12px' }}>Smart Contract Explainer</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>Paste any Solidity contract and get a plain-English breakdown instantly.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '24px', maxWidth: result ? '100%' : '800px', margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Paste your Solidity contract below</span>
              <button onClick={() => setCode(EXAMPLE)} style={{ fontSize: '12px', color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Mono, monospace' }}>
                Load Example →
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="// paste your solidity contract here..."
              style={{ width: '100%', height: '380px', backgroundColor: 'var(--card)', color: '#ccc', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px', fontFamily: 'Space Mono, monospace', fontSize: '13px', lineHeight: '1.8', resize: 'vertical', outline: 'none' }}
            />
            {error && <p style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
            <button onClick={explain} style={{ marginTop: '16px', width: '100%', padding: '16px', backgroundColor: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.05em' }}>
              EXPLAIN THIS CONTRACT →
            </button>
          </div>

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <p className="mono" style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>SUMMARY</p>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '8px' }}>{result.summary}</p>
                  <span style={{ fontSize: '12px', backgroundColor: 'rgba(0,255,148,0.1)', color: 'var(--green)', padding: '4px 12px', borderRadius: '20px', fontFamily: 'Space Mono, monospace' }}>{result.type}</span>
                </div>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: scoreColor, fontFamily: 'Space Mono, monospace' }}>{result.score}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>SECURITY</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
                <p className="mono" style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', marginBottom: '16px' }}>FUNCTIONS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.functions?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <span className="mono" style={{ fontSize: '13px', color: 'var(--green)' }}>{f.name}()</span>
                        <p style={{ fontSize: '13px', color: '#888', marginTop: '4px', lineHeight: '1.6' }}>{f.what}</p>
                      </div>
                      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap', backgroundColor: f.risk === 'high' ? 'rgba(255,77,77,0.1)' : f.risk === 'medium' ? 'rgba(240,165,0,0.1)' : 'rgba(0,255,148,0.1)', color: f.risk === 'high' ? '#ff4d4d' : f.risk === 'medium' ? '#f0a500' : 'var(--green)' }}>{f.risk} risk</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.risks?.length > 0 && (
                <div style={{ backgroundColor: 'rgba(255,77,77,0.05)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: '4px', padding: '24px' }}>
                  <p className="mono" style={{ fontSize: '11px', color: '#ff4d4d', letterSpacing: '0.1em', marginBottom: '16px' }}>RISKS DETECTED</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.risks.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>
                        <span style={{ color: '#ff4d4d' }}>▸</span>{r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}