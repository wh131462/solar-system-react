

import * as THREE from 'three';
import { PLANETS } from '../data/planets';
import { Icons } from '../data/icons';
import { useApp } from '../store/AppContext';

export default function Sidebar() {
  const { state, focusOnPlanet } = useApp();
  return (
    <div id="sidebar">
      <div className="planet-list">
        {PLANETS.map((p, i) => {
          const color = '#' + new THREE.Color(p.color).getHexString();
          const CheckIcon = Icons.check;
          return (
            <div key={p.id} className={`planet-item${i === state.selectedPlanet ? ' active' : ''}`} onClick={() => focusOnPlanet(i)}>
              <div className="dot" style={{ background: color }} />
              <div><div className="name">{p.name}</div><div className="name-en">{p.nameEn}</div></div>
              <div className="visited-mark">{state.visitedPlanets.has(i) && <CheckIcon />}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
