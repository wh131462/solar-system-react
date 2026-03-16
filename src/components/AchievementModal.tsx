import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { Icons } from '../data/icons';
import { useApp } from '../store/AppContext';

export default function AchievementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useApp();
  const total = ACHIEVEMENTS.length;
  const unlocked = state.unlockedAchievements.size;

  return (
    <div className={`modal-overlay${open ? ' show' : ''}`}>
      <div className="modal" style={{width:500}}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>&times;</button>
          <h3 style={{fontSize:'17px',marginBottom:'4px'}}>探索成就</h3>
          <div className="progress-bar" style={{marginBottom:'0'}}><div className="fill" style={{width:`${(unlocked/total)*100}%`}}/></div>
        </div>
        <div className="modal-body">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = state.unlockedAchievements.has(a.id);
            const Icon = Icons[a.icon]; const CheckIcon = Icons.check; const LockIcon = Icons.lock;
            return (
              <div className={`achievement-item${isUnlocked?' unlocked':''}`} key={a.id}>
                <div className="badge">{Icon ? <Icon /> : null}</div>
                <div><div className="ach-name">{a.name}</div><div className="ach-desc">{a.desc}</div></div>
                <div style={{color:isUnlocked?'#4a8':'#334',marginLeft:'auto'}}>{isUnlocked ? <CheckIcon /> : <LockIcon />}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
