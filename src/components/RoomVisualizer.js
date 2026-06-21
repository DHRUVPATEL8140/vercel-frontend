import React, { useRef, useState } from 'react';

// Enhanced professional look for the mattress preview
function MattressPreview({ model, x, y, rotation, scale, onPointerDown }) {
  const getGradientAndBorder = () => {
    switch (model) {
      case 'm1':
        return {
          background: 'linear-gradient(135deg, #e6f4fe 0%, #cce7ff 100%)',
          borderColor: '#a3d3ff',
          badgeBg: '#0070f3',
        };
      case 'm2':
        return {
          background: 'linear-gradient(135deg, #fff5ec 0%, #ffe3cc 100%)',
          borderColor: '#ffc499',
          badgeBg: '#d97706',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderColor: '#bbf7d0',
          badgeBg: '#16a34a',
        };
    }
  };

  const config = getGradientAndBorder();

  const style = {
    position: 'absolute',
    left: x,
    top: y,
    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
    transformOrigin: 'center center',
    width: 280,
    height: 130,
    borderRadius: 16,
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 1px 1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    background: config.background,
    border: `2px solid ${config.borderColor}`,
    userSelect: 'none',
    touchAction: 'none',
    transition: 'box-shadow 0.2s ease',
  };

  const textStyle = {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '15px',
    letterSpacing: '-0.01em',
    marginBottom: '4px',
  };

  const badgeStyle = {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 700,
    color: '#fff',
    backgroundColor: config.badgeBg,
    padding: '2px 8px',
    borderRadius: '12px',
  };

  return (
    <div
      style={style}
      onPointerDown={onPointerDown}
      role="img"
      aria-label="Mattress placeholder"
      onPointerOver={(e) => (e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 1px 1px rgba(0,0,0,0.1)')}
      onPointerOut={(e) => (e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 1px 1px rgba(0,0,0,0.05)')}
    >
      <div style={textStyle}>
        {model === 'm1' ? 'Soft Mattress' : model === 'm2' ? 'Medium Mattress' : 'Firm Mattress'}
      </div>
      <div style={badgeStyle}>3D Preview</div>
    </div>
  );
}

export default function RoomVisualizer() {
  const [bgSrc, setBgSrc] = useState(null);
  const [model, setModel] = useState('m2');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: '50%', y: '65%' });
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const handleUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setBgSrc(url);
  };

  const onPointerDownMattress = (e) => {
    const el = canvasRef.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;

    const rect = el.getBoundingClientRect();
    const curX = (parseFloat(pos.x) / 100) * rect.width || rect.width / 2;
    const curY = (parseFloat(pos.y) / 100) * rect.height || rect.height * 0.65;
    dragRef.current.origX = curX;
    dragRef.current.origY = curY;

    const move = (ev) => {
      if (!dragRef.current.dragging) return;
      const dx = (ev.clientX - dragRef.current.startX) / zoom;
      const dy = (ev.clientY - dragRef.current.startY) / zoom;
      const newX = dragRef.current.origX + dx;
      const newY = dragRef.current.origY + dy;
      const pctX = Math.round((newX / rect.width) * 100);
      const pctY = Math.round((newY / rect.height) * 100);
      setPos({ x: `${pctX}%`, y: `${pctY}%` });
    };

    const up = () => {
      dragRef.current.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      e.currentTarget.releasePointerCapture(e.pointerId);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // Modern UI Styles
  const pageWrapperStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: 1100,
    margin: '2rem auto',
    padding: '0 24px',
    color: '#0f172a',
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    marginBottom: '6px',
    color: '#0f172a',
  };

  const subHeaderStyle = {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: 1.5,
  };

  const controlsCardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  };

  const controlGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 180px',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#1e293b',
    outline: 'none',
    cursor: 'pointer',
  };

  const fileInputWrapperStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const customFileBtnStyle = {
    padding: '8px 16px',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-block',
    border: 'none',
  };

  const resetBtnStyle = {
    padding: '8px 16px',
    background: '#f1f5f9',
    color: '#334155',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    alignSelf: 'flex-end',
    height: '38px',
    transition: 'background 0.2s',
  };

  const containerStyle = {
    width: '100%',
    height: 580,
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  };

  const innerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
  };

  const placeholderStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    gap: '12px',
  };

  const footerTextStyle = {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.6,
    marginTop: '16px',
    textAlign: 'center',
  };

  return (
    <div style={pageWrapperStyle}>
      <h2 style={headerStyle}>Room Visualizer Pro</h2>
      <p style={subHeaderStyle}>
        Upload a bedroom photo to experiment with real-time mattress placements. Adjust orientation, scale, and canvas zoom for realistic scaling.
      </p>

      {/* Control Panel Card */}
      <div style={controlsCardStyle}>
        <div style={controlGroupStyle}>
          <span style={labelStyle}>Bedroom Scene</span>
          <div style={fileInputWrapperStyle}>
            <label htmlFor="file-upload" style={customFileBtnStyle}>
              {bgSrc ? 'Replace Image' : 'Upload Image'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Mattress Model</label>
          <select style={selectStyle} value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="m1">Soft Mattress</option>
            <option value="m2">Medium Mattress</option>
            <option value="m3">Firm Mattress</option>
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Canvas Zoom</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ accentColor: '#0f172a' }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Rotation ({rotation}°)</label>
          <input
            type="range"
            min="-90"
            max="90"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            style={{ accentColor: '#0f172a' }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Size Scale</label>
          <input
            type="range"
            min="0.5"
            max="1.6"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ accentColor: '#0f172a' }}
          />
        </div>

        <button
          style={resetBtnStyle}
          onClick={() => {
            setPos({ x: '50%', y: '65%' });
            setRotation(0);
            setScale(1);
            setZoom(1);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        >
          Reset View
        </button>
      </div>

      {/* Main Canvas Viewport */}
      <div style={containerStyle} ref={canvasRef}>
        <div style={innerStyle}>
          {bgSrc ? (
            <img src={bgSrc} alt="Room background" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={placeholderStyle}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Upload a background photograph to get started</span>
            </div>
          )}

          <MattressPreview model={model} x={pos.x} y={pos.y} rotation={rotation} scale={scale} onPointerDown={onPointerDownMattress} />
        </div>
      </div>

      <p style={footerTextStyle}>
        <strong>Interaction Guide:</strong> Direct click and drag on the mattress object will reposition it seamlessly across your space profile. This environment serves as a layout tool. For structural implementation, look into WebGL matrices or native AR viewports.
      </p>
    </div>
  );
}