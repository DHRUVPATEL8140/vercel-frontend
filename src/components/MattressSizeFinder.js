import React, { useState } from 'react';

const SIZES = [
  { id: 'single', name: 'Single', w: 90, l: 190, sleepers: 1 },
  { id: 'single_xl', name: 'Single XL', w: 90, l: 200, sleepers: 1 },
  { id: 'double', name: 'Double/Full', w: 135, l: 190, sleepers: 2 },
  { id: 'queen', name: 'Queen', w: 150, l: 200, sleepers: 2 },
  { id: 'king', name: 'King', w: 180, l: 200, sleepers: 2 },
  { id: 'cal_king', name: 'Cal King', w: 182, l: 210, sleepers: 2 }
];

function scoreSize(size, inputs) {
  let score = 0;
  const margin = 5; 
  const fitsFrame = !inputs.frameWidth || !inputs.frameLength || (size.w <= inputs.frameWidth - margin && size.l <= inputs.frameLength - margin);
  const fitsRoom = !inputs.roomWidth || !inputs.roomLength || (size.w + 60 <= inputs.roomWidth && size.l + 60 <= inputs.roomLength);
  const sleepersOk = (size.sleepers >= inputs.sleepers);
  
  if (fitsFrame) score += 40;
  if (fitsRoom) score += 30;
  if (sleepersOk) score += 20;
  if (inputs.heightPref === 'tall' && size.l >= 200) score += 10;
  if (inputs.heightPref === 'short' && size.l <= 190) score += 5;
  
  return { score, fitsFrame, fitsRoom, sleepersOk };
}

export default function MattressSizeFinder() {
  const [inputs, setInputs] = useState({ sleepers: 2, roomWidth: '', roomLength: '', frameWidth: '', frameLength: '', heightPref: 'average' });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value === '' ? '' : (name === 'sleepers' ? Number(value) : Number(value) || value) }));
  };

  const run = (e) => {
    e && e.preventDefault();
    const evaluated = SIZES.map(s => {
      const r = scoreSize(s, inputs);
      return { ...s, ...r, confidence: Math.min(99, Math.round((r.score / 100) * 100)) };
    }).sort((a, b) => b.score - a.score);
    setResults(evaluated);
  };

  // --- Design System Tokens ---
  const theme = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    textMain: '#0f172a',
    textMuted: '#64748b',
    primary: '#0f172a',
    primaryHover: '#1e293b',
    successBg: '#ecfdf5',
    successText: '#15803d',
    errorBg: '#fef2f2',
    errorText: '#b91c1c',
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, maxWidth: 960, margin: '2.5rem auto', padding: '0 20px', color: theme.textMain }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>Mattress Size Finder</h2>
        <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0 }}>
          Input your bedroom architecture, sleeper count, and bed frame clearances to instantly calculate the ideal mattress dimensions.
        </p>
      </div>

      {/* Main Interactive Configurator Card */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <form onSubmit={run} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Number of Sleepers</label>
            <select name="sleepers" value={inputs.sleepers} onChange={handleChange} style={styles.inputField}>
              <option value={1}>1 Sleeper</option>
              <option value={2}>2 Sleepers</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Sleeper Height Profile</label>
            <select name="heightPref" value={inputs.heightPref} onChange={handleChange} style={styles.inputField}>
              <option value="short">Petite (&lt; 180cm)</option>
              <option value="average">Standard / Average</option>
              <option value="tall">Tall (&gt;= 190cm)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Room Width (cm)</label>
            <input name="roomWidth" type="number" value={inputs.roomWidth} onChange={handleChange} placeholder="e.g. 330" style={styles.inputField} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Room Length (cm)</label>
            <input name="roomLength" type="number" value={inputs.roomLength} onChange={handleChange} placeholder="e.g. 420" style={styles.inputField} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Bed Frame Inner Width (cm)</label>
            <input name="frameWidth" type="number" value={inputs.frameWidth} onChange={handleChange} placeholder="e.g. 160" style={styles.inputField} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted }}>Bed Frame Inner Length (cm)</label>
            <input name="frameLength" type="number" value={inputs.frameLength} onChange={handleChange} placeholder="e.g. 210" style={styles.inputField} />
          </div>

          {/* Form Controls */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '20px' }}>
            <button type="submit" style={styles.primaryBtn}>Find Optimal Match</button>
            <button type="button" style={styles.secondaryBtn} onClick={() => { setInputs({ sleepers: 2, roomWidth: '', roomLength: '', frameWidth: '', frameLength: '', heightPref: 'average' }); setResults(null); }}>Reset</button>
          </div>
        </form>
      </div>

      {/* Results Workspace */}
      {results && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.01em' }}>Target Recommendations</h3>
          
          {/* Top Matches Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '2.5rem' }}>
            {results.slice(0, 3).map((r, idx) => (
              <div key={r.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', position: 'relative' }}>
                {idx === 0 && <span style={styles.topMatchBadge}>Best Match</span>}
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>{r.name}</div>
                <div style={{ fontSize: '13px', color: theme.textMuted, fontWeight: 500, marginBottom: '14px' }}>{r.w} × {r.l} cm</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={r.fitsFrame ? styles.tagSuccess : styles.tagError}>
                    {r.fitsFrame ? '✓ Seamless Frame Fit' : '✕ Exceeds Frame Limits'}
                  </div>
                  <div style={r.fitsRoom ? styles.tagSuccess : styles.tagError}>
                    {r.fitsRoom ? '✓ Clear Room Space' : '✕ Limited Room Clearance'}
                  </div>
                  <div style={r.sleepersOk ? styles.tagSuccess : styles.tagError}>
                    {r.sleepersOk ? '✓ Roomy for Sleepers' : '✕ Cramped for Sleepers'}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${theme.border}`, paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', color: theme.textMuted, letterSpacing: '0.05em', fontWeight: 600 }}>Match Score</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0284c7' }}>{r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fully Formatted Matrix Comparison Table */}
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Comprehensive Matrix Comparison</h4>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Size Silhouette</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Width</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Length</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Sleepers</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Frame Compliant</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted }}>Room Compliant</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: theme.textMuted, textAlign: 'right' }}>Compatibility</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>{r.w} cm</td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>{r.l} cm</td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>{r.sleepers} {r.sleepers === 1 ? 'person' : 'people'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={r.fitsFrame ? { color: theme.successText, fontWeight: 500 } : { color: theme.errorText }}>
                          {r.fitsFrame ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={r.fitsRoom ? { color: theme.successText, fontWeight: 500 } : { color: theme.errorText }}>
                          {r.fitsRoom ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: theme.textMain }}>{r.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Clean Styles Object (Extracting view clutter out of the DOM render tree)
const styles = {
  inputField: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    transition: 'border-color 0.15s ease',
  },
  primaryBtn: {
    padding: '10px 20px',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s',
  },
  secondaryBtn: {
    padding: '10px 20px',
    background: '#f1f5f9',
    color: '#334155',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s',
  },
  topMatchBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#f0fdf4',
    color: '#16a34a',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid #bbf7d0',
  },
  tagSuccess: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '6px',
    background: '#f0fdf4',
    color: '#16a34a',
    fontWeight: 500,
  },
  tagError: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '6px',
    background: '#fef2f2',
    color: '#dc2626',
    fontWeight: 500,
  }
};