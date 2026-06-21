import React, { useState } from 'react';

const CANDIDATES = [
  {
    id: 'memory_pillow',
    name: 'Memory Foam Pillow',
    type: 'pillow',
    support: 'medium',
    softness: 'medium',
    bestForPositions: ['back', 'side'],
    note: 'Conforms to head/neck; good for back and side sleepers.'
  },
  {
    id: 'latex_pillow',
    name: 'Latex Pillow',
    type: 'pillow',
    support: 'high',
    softness: 'firm',
    bestForPositions: ['back', 'side'],
    note: 'Bouncy and supportive; durable.'
  },
  {
    id: 'soft_pillow',
    name: 'Soft Down-Like Pillow',
    type: 'pillow',
    support: 'low',
    softness: 'soft',
    bestForPositions: ['stomach'],
    note: 'Low loft for stomach sleepers.'
  },
  {
    id: 'soft_mattress',
    name: 'Soft Plush Mattress',
    type: 'mattress',
    support: 'low',
    softness: 'soft',
    bestForPositions: ['side'],
    note: 'Pressure-relieving, good for side sleepers.'
  },
  {
    id: 'medium_mattress',
    name: 'Medium-Firm Mattress',
    type: 'mattress',
    support: 'medium',
    softness: 'medium',
    bestForPositions: ['back', 'side'],
    note: 'Balanced support and comfort; good general choice.'
  },
  {
    id: 'firm_mattress',
    name: 'Firm Support Mattress',
    type: 'mattress',
    support: 'high',
    softness: 'firm',
    bestForPositions: ['stomach', 'back'],
    note: 'Offers strong support; helpful for heavier users and back pain.'
  }
];

function scoreCandidate(candidate, answers) {
  let score = 0;
  
  // 1. Sleeping position (Max: 30)
  if (candidate.bestForPositions.includes(answers.sleepingPosition)) score += 30;

  // 2. Weight matrix rules (Max: 25)
  if (answers.weight) {
    const w = Number(answers.weight);
    if (w > 90 && candidate.support === 'high') score += 25;
    else if (w > 75 && candidate.support !== 'low') score += 15;
    else if (w <= 75 && candidate.support === 'low') score += 10;
  }

  // 3. Back pain rules (Max: 25)
  if (answers.backPain === 'yes') {
    if (candidate.type === 'mattress' && candidate.support === 'high') score += 25;
    if (candidate.type === 'pillow' && candidate.support !== 'low') score += 15;
  }

  // 4. Softness configuration rules (Max: 20)
  if (answers.preferredSoftness) {
    if (answers.preferredSoftness === candidate.softness) score += 20;
    else if (answers.preferredSoftness === 'medium' && candidate.softness !== 'soft') score += 8;
  }

  // 5. Age logic modifiers (Max: 10)
  if (answers.age) {
    const a = Number(answers.age);
    if (a >= 60 && candidate.softness === 'medium') score += 10;
  }

  return score;
}

export default function AIRecommendation() {
  const [answers, setAnswers] = useState({
    sleepingPosition: 'back', weight: '', age: '', backPain: 'no', preferredSoftness: 'medium'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const scored = CANDIDATES.map(c => ({ ...c, score: scoreCandidate(c, answers) }));
    scored.sort((a, b) => b.score - a.score);
    
    const top = scored[0];

    // FIX: Score evaluated against the true system maximum limit (110) instead of top / top
    const MAX_THEORETICAL_SCORE = 110;
    const confidence = Math.max(15, Math.min(98, Math.round((top.score / MAX_THEORETICAL_SCORE) * 100)));

    const reasons = [];
    if (top.bestForPositions.includes(answers.sleepingPosition)) reasons.push('Engineered explicitly to support your dynamic sleep orientation.');
    if (answers.backPain === 'yes' && top.support === 'high') reasons.push('High structural support helps preserve natural spinal alignment and mitigate structural discomfort.');
    if (answers.weight && Number(answers.weight) > 90 && top.support === 'high') reasons.push('Optimized baseline support threshold tailored for heavier load parameters.');
    if (answers.preferredSoftness === top.softness) reasons.push('Directly matches your requested firmness and sinking feel profiles.');
    if (reasons.length === 0) reasons.push(top.note);

    setResult({ product: top, confidence, reasons });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header Panel */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={styles.mainTitle}>Sleep System Matcher</h2>
        <p style={styles.subtitleText}>
          Complete the assessment below. Our diagnostic mapping matching algorithm computes structural parameters to recommend optimal surfaces.
        </p>
      </div>

      <div style={styles.workspaceSplit}>
        {/* Interactive Configuration Panel */}
        <form onSubmit={handleSubmit} style={styles.configuratorCard}>
          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Primary Sleeping Position</label>
            <select name="sleepingPosition" value={answers.sleepingPosition} onChange={handleChange} style={styles.selectInput}>
              <option value="back">Back Sleeper</option>
              <option value="side">Side Sleeper</option>
              <option value="stomach">Stomach Sleeper</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Body Weight (kg)</label>
            <input name="weight" type="number" value={answers.weight} onChange={handleChange} placeholder="e.g. 74" style={styles.textInput} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Age (Years)</label>
            <input name="age" type="number" value={answers.age} onChange={handleChange} placeholder="e.g. 34" style={styles.textInput} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Do you experience persistent back pain?</label>
            <div style={styles.radioWrapper}>
              <label style={answers.backPain === 'yes' ? styles.radioTabActive : styles.radioTab}>
                <input type="radio" name="backPain" value="yes" checked={answers.backPain === 'yes'} onChange={handleChange} style={{ display: 'none' }} />
                Yes, experiencing pain
              </label>
              <label style={answers.backPain === 'no' ? styles.radioTabActive : styles.radioTab}>
                <input type="radio" name="backPain" value="no" checked={answers.backPain === 'no'} onChange={handleChange} style={{ display: 'none' }} />
                No pain reported
              </label>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Target Surface Softness Profile</label>
            <select name="preferredSoftness" value={answers.preferredSoftness} onChange={handleChange} style={styles.selectInput}>
              <option value="soft">Soft Cushioning</option>
              <option value="medium">Balanced / Medium</option>
              <option value="firm">Firm Contour / Solid</option>
            </select>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Generate Analytical Profile
          </button>
        </form>

        {/* Dynamic Context Result Panel */}
        <div style={styles.resultsContainer}>
          {result ? (
            <div style={styles.resultCard}>
              <div style={styles.cardHeaderRow}>
                <span style={styles.productTypeTag}>{result.product.type}</span>
                <div style={styles.metricBadge}>
                  <span style={styles.metricLabel}>Match Integrity</span>
                  <span style={styles.metricVal}>{result.confidence}%</span>
                </div>
              </div>

              <h3 style={styles.productNameTitle}>{result.product.name}</h3>
              <p style={styles.productDescription}>{result.product.note}</p>

              <div style={styles.divider} />

              <h4 style={styles.reasonsHeading}>Diagnostic Selection Rationale:</h4>
              <ul style={styles.reasonsList}>
                {result.reasons.map((reason, index) => (
                  <li key={index} style={styles.reasonItem}>
                    <span style={styles.checkIcon}>✓</span>
                    {reason}
                  </li>
                ))}
              </ul>

              <div style={styles.disclaimerBox}>
                <strong>Disclaimer Notice:</strong> Recommendation rules are generated computationally based on ergonomic assumptions. For chronic clinical conditions or spinal issues, request medical evaluations from specialists.
              </div>
            </div>
          ) : (
            <div style={styles.emptyPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473M12 3v13.5m0-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm0 0a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
              </svg>
              <p style={{ margin: 0, fontWeight: 500 }}>Awaiting Diagnostics Input Parameters</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>Fill out the evaluation form on the left to compute the product matrix match profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Modern E-Commerce UI System Design Tokens
const styles = {
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: 1040,
    margin: '3rem auto',
    padding: '0 24px',
    color: '#0f172a',
    backgroundColor: '#fafafa'
  },
  mainTitle: {
    fontSize: '30px',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    color: '#0f172a',
    marginBottom: '6px'
  },
  subtitleText: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 700
  },
  workspaceSplit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '28px',
    marginTop: '24px',
    alignItems: 'start'
  },
  configuratorCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  fieldLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155'
  },
  selectInput: {
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    cursor: 'pointer'
  },
  textInput: {
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none'
  },
  radioWrapper: {
    display: 'flex',
    gap: '10px'
  },
  radioTab: {
    flex: 1,
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 500,
    color: '#475569',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.15s ease'
  },
  radioTabActive: {
    flex: 1,
    padding: '12px',
    border: '2px solid #0f172a',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#f8fafc',
    transition: 'all 0.15s ease'
  },
  submitBtn: {
    padding: '13px',
    background: '#0f172a',
    color: '#ffffff',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    marginTop: '10px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
    transition: 'background 0.2s'
  },
  resultsContainer: {
    height: '100%'
  },
  emptyPlaceholder: {
    border: '2px dashed #e2e8f0',
    borderRadius: '16px',
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#64748b',
    height: '100%',
    minHeight: '340px',
    boxSizing: 'border-box'
  },
  resultCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  productTypeTag: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 700,
    background: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: '6px'
  },
  metricBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  metricLabel: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: '#64748b',
    fontWeight: 500,
    letterSpacing: '0.02em'
  },
  metricVal: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0284c7'
  },
  productNameTitle: {
    fontSize: '22px',
    fontWeight: 700,
    margin: '0 0 6px 0',
    letterSpacing: '-0.01em'
  },
  productDescription: {
    fontSize: '14px',
    color: '#475569',
    margin: 0,
    lineHeight: 1.5
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '20px 0'
  },
  reasonsHeading: {
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 12px 0'
  },
  reasonsList: {
    listStyleType: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  reasonItem: {
    fontSize: '13.5px',
    lineHeight: 1.5,
    color: '#334155',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  },
  checkIcon: {
    color: '#16a34a',
    fontWeight: 'bold',
    userSelect: 'none'
  },
  disclaimerBox: {
    background: '#fffbeb',
    border: '1px solid #fef3c7',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '12px',
    color: '#b45309',
    lineHeight: 1.5
  }
};