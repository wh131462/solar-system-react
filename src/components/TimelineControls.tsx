import { useState, useCallback } from 'react';
import { useApp } from '../store/AppContext';

const SPEEDS = [0.1, 0.5, 1, 2, 5, 10, 30, 100, 365];
function formatDate(ts: number): string { const d = new Date(ts); return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`; }
function formatSpeed(s: number): string { if (s < 1) return `${Math.round(s*24)}时/秒`; if (s < 365) return `${s}天/秒`; return `${(s/365).toFixed(1)}年/秒`; }

export default function TimelineControls() {
  const { state, dispatch } = useApp();
  const [speedIdx, setSpeedIdx] = useState(2);
  const changeSpeed = useCallback((delta: number) => {
    setSpeedIdx(prev => {
      const next = Math.max(0, Math.min(SPEEDS.length-1, prev+delta));
      dispatch({ type: 'SET_SIM_SPEED', payload: SPEEDS[next] });
      dispatch({ type: 'SET_MAX_SPEED', payload: SPEEDS[next] });
      return next;
    });
  }, [dispatch]);

  return (
    <div id="timeline">
      <div className="time-controls">
        <button onClick={() => changeSpeed(-1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 20L9 12l10-8v16zM7 4h2v16H7V4z"/></svg></button>
        <button onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>
          {state.paused ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}
        </button>
        <button onClick={() => changeSpeed(1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l10 8-10 8V4zM15 4h2v16h-2V4z"/></svg></button>
        <button style={{fontSize:'11px'}} onClick={() => dispatch({ type: 'SET_SIM_TIME', payload: Date.now() })}>今天</button>
      </div>
      <div className="time-display">{formatDate(state.simTime)}</div>
      <div className="slider-wrap"><input type="range" min="-3650" max="3650" defaultValue="0" onChange={e => dispatch({ type: 'SET_SIM_TIME', payload: Date.now()+Number(e.target.value)*86400000 })} /></div>
      <div className="speed-label">{formatSpeed(SPEEDS[speedIdx])}</div>
    </div>
  );
}
