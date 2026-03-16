import React from 'react';
import { PLANETS } from '../data/planets';
import { useApp } from '../store/AppContext';

export default function LabPanel() {
  const { state, dispatch } = useApp();
  if (state.currentMode !== 'lab') return null;
  const planet = state.selectedPlanet >= 0 ? PLANETS[state.selectedPlanet] : null;
  const lab = planet ? state.labState[planet.id] : null;

  return (
    <div id="lab-panel" className="show">
      <h3>物理实验室</h3>
      <div className="lab-control">
        <label>质量倍数 <span>{lab ? lab.massMul.toFixed(1)+'x' : '1.0x'}</span></label>
        <input type="range" min="0.1" max="20" step="0.1" value={lab?.massMul ?? 1}
          onChange={e => { if (!planet||!lab) return; dispatch({ type: 'UPDATE_LAB', payload: { id: planet.id, massMul: +e.target.value, distMul: lab.distMul, ecc: lab.ecc } }); dispatch({ type: 'SET_USED_LAB' }); }} />
      </div>
      <div className="lab-control">
        <label>轨道半径 <span>{lab ? lab.distMul.toFixed(2)+'x' : '1.00x'}</span></label>
        <input type="range" min="0.2" max="3" step="0.05" value={lab?.distMul ?? 1}
          onChange={e => { if (!planet||!lab) return; dispatch({ type: 'UPDATE_LAB', payload: { id: planet.id, massMul: lab.massMul, distMul: +e.target.value, ecc: lab.ecc } }); dispatch({ type: 'SET_USED_LAB' }); }} />
      </div>
      <div className="lab-control">
        <label>离心率 <span>{lab ? lab.ecc.toFixed(2) : '0.00'}</span></label>
        <input type="range" min="0" max="0.8" step="0.01" value={lab?.ecc ?? 0}
          onChange={e => { if (!planet||!lab) return; dispatch({ type: 'UPDATE_LAB', payload: { id: planet.id, massMul: lab.massMul, distMul: lab.distMul, ecc: +e.target.value } }); dispatch({ type: 'SET_USED_LAB' }); }} />
      </div>
      <div className="lab-btn-group">
        <button className="lab-btn" onClick={() => planet && dispatch({ type: 'RESET_LAB', payload: planet.id })}>重置</button>
        <button className="lab-btn" onClick={() => dispatch({ type: 'TOGGLE_TRAILS' })}>轨迹</button>
        <button className="lab-btn" onClick={() => dispatch({ type: 'TOGGLE_GRAVITY' })}>引力线</button>
      </div>
      <div style={{marginTop:'12px',fontSize:'11px',color:'#556',lineHeight:1.6}}>{planet ? `正在调整: ${planet.name}` : '选中行星后调整参数'}</div>
    </div>
  );
}
