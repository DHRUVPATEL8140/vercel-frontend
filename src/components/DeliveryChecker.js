import React, { useState } from 'react';

const COVERAGE = {
  '560001': { available: true, days: 2, charge: 50, warehouse: 'Bengaluru Warehouse' },
  '110001': { available: true, days: 3, charge: 70, warehouse: 'Delhi Warehouse' },
  '400001': { available: true, days: 4, charge: 80, warehouse: 'Mumbai Warehouse' },
  '600001': { available: true, days: 3, charge: 65, warehouse: 'Chennai Warehouse' },
};

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const validate = (pc) => {
    if (!pc) return 'Pincode is required';
    if (!/^[0-9]{6}$/.test(pc)) return 'Pincode must be exactly 6 numerical digits';
    return '';
  };

  const handleInputChange = (e) => {
    // Sanitize input explicitly at the target level to maintain seamless DOM state alignment
    const sanitizedValue = e.target.value.replace(/\D/g, '');
    setPincode(sanitizedValue);
    
    // Clear alerts dynamically as the user types to reduce frustration
    if (error) setError('');
  };

  const check = (e) => {
    if (e) e.preventDefault();
    setError('');
    setResult(null);

    const err = validate(pincode);
    if (err) { 
      setError(err); 
      return; 
    }

    const data = COVERAGE[pincode];
    if (data) {
      setResult({ available: true, pincode, ...data });
    } else {
      const first = pincode[0];
      if (['1', '2', '3', '4'].includes(first)) {
        setResult({ available: true, pincode, days: 5, charge: 120, warehouse: 'Nearest Metro Hub' });
      } else if (['5', '6', '7'].includes(first)) {
        setResult({ available: true, pincode, days: 4, charge: 100, warehouse: 'Regional Fulfillment Center' });
      } else {
        setResult({ available: false, pincode, days: null, charge: null, warehouse: null });
      }
    }
  };

  const clearForm = (e) => {
    if (e) e.preventDefault(); // Protect layout structure constraints
    setPincode('');
    setResult(null);
    setError('');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.widgetCard}>
        {/* Card Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={styles.title}>Delivery Availability</h2>
          <p style={styles.subtitle}>Verify immediate logistical fulfillment options, shipping rates, and dispatch timelines for your region.</p>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={check} style={styles.formLayout}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              inputMode="numeric"
              value={pincode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              style={error ? styles.inputFieldError : styles.inputField}
            />
            {error && <span style={styles.errorText}>{error}</span>}
          </div>
          
          <div style={styles.btnActionGroup}>
            <button type="submit" style={styles.primaryBtn}>Check Coverage</button>
            <button type="button" onClick={clearForm} style={styles.secondaryBtn}>Clear</button>
          </div>
        </form>

        {/* Result Dashboards */}
        {result && (
          <div style={result.available ? styles.successPanel : styles.dangerPanel}>
            {!result.available ? (
              <div style={styles.outcomeContent}>
                <div style={styles.statusTitleRow}>
                  <span style={styles.statusIconDanger}>✕</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Service Unavailable</h4>
                </div>
                <p style={styles.outcomeDesc}>
                  We do not provide standard logistical routing to area <strong>{result.pincode}</strong>. Please contact custom accounts support to request specialized courier routing options.
                </p>
              </div>
            ) : (
              <div style={styles.outcomeContent}>
                <div style={styles.statusTitleRow}>
                  <span style={styles.statusIconSuccess}>✓</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Logistics Path Confirmed</h4>
                </div>
                
                <div style={styles.metricGrid}>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Delivery Duration</span>
                    <span style={styles.metricValue}>{result.days} {result.days === 1 ? 'Business Day' : 'Business Days'}</span>
                  </div>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Shipping Fee</span>
                    <span style={styles.metricValue}>₹{result.charge}</span>
                  </div>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Dispatch Hub</span>
                    <span style={styles.metricValue}>{result.warehouse}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Hints/Footer */}
        {!result && (
          <div style={styles.tipBox}>
            <span style={{ fontWeight: 600 }}>Active Test Hubs:</span> Try entering indexed regional codes such as <code style={styles.codeTag}>560001</code> (South), <code style={styles.codeTag}>110001</code> (North), or <code style={styles.codeTag}>400001</code> (West).
          </div>
        )}
      </div>
    </div>
  );
}

// Logistics Core Theme Variables
const styles = {
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 680,
    margin: '3.5rem auto',
    padding: '0 16px',
    color: '#0f172a'
  },
  widgetCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5
  },
  formLayout: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: '1 1 240px'
  },
  inputField: {
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  },
  inputFieldError: {
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '2px solid #ef4444',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: 500
  },
  btnActionGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'nowrap'
  },
  primaryBtn: {
    padding: '11px 18px',
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  secondaryBtn: {
    padding: '11px 18px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  successPanel: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '20px'
  },
  dangerPanel: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '12px',
    padding: '20px'
  },
  statusTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  statusIconSuccess: {
    color: '#16a34a',
    fontWeight: 800,
    fontSize: '16px'
  },
  statusIconDanger: {
    color: '#dc2626',
    fontWeight: 800,
    fontSize: '14px'
  },
  outcomeContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  outcomeDesc: {
    fontSize: '14px',
    color: '#451a03',
    lineHeight: 1.5,
    margin: 0
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  metricCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  metricLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#64748b',
    fontWeight: 600,
    letterSpacing: '0.02em'
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b'
  },
  tipBox: {
    fontSize: '13px',
    color: '#475569',
    background: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    lineHeight: 1.5
  },
  codeTag: {
    fontFamily: 'monospace',
    background: '#e2e8f0',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#0f172a'
  }
};