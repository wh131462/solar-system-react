

import { PLANETS } from '../data/planets';
import { useApp } from '../store/AppContext';

function formatDate(ts: number): string { const d = new Date(ts); return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`; }

export default function ObservePanel() {
  const { state } = useApp();
  if (state.currentMode !== 'observe') return null;
  const simDays = state.simTime / 86400000;

  return (
    <div id="observe-panel" className="show">
      <h3 style={{fontSize:'15px',marginBottom:'4px'}}>今晚可见天体</h3>
      <div style={{fontSize:'11px',color:'#556',marginBottom:'12px'}}>{formatDate(state.simTime)} 夜间</div>
      <div>
        {PLANETS.slice(1).map(p => {
          const angle = simDays * p.speed * 0.15;
          const elong = Math.abs(Math.sin(angle - simDays * 0.15));
          const vis = p.distance > 30 ? elong > 0.2 : elong > 0.4;
          const bright = vis ? (p.mass > 10 ? '明亮' : p.mass > 0.5 ? '可见' : '微弱') : '不可见';
          const dotColor = vis ? (p.mass > 10 ? '#4a8' : '#6cf') : '#333';
          const dirs = ['东方','南偏东','南方','南偏西','西方'];
          const dir = dirs[Math.abs(Math.sin(angle*0.7))*5|0];
          return (<div className="observe-planet" key={p.id}><div className="vis-dot" style={{background:dotColor}}/><div style={{flex:1}}><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:'11px',color:'#667'}}>{vis?`${bright} · ${dir}`:'今晚不可见'}</div></div></div>);
        })}
      </div>
    </div>
  );
}
