import React from 'react';
import { useApp } from "../store/AppContext";
import type { AppMode } from '../store/AppContext';

const modes: { mode: AppMode; label: string }[] = [
  { mode: 'explore', label: '自由探索' },
  { mode: 'knowledge', label: '知识图谱' },
  { mode: 'lab', label: '物理实验' },
  { mode: 'observe', label: '今晚观测' },
];

export default function TopBar({ onOpenAchievements }: { onOpenAchievements: () => void }) {
  const { state, dispatch } = useApp();
  return (
    <div id="topbar">
      <div className="logo"><span>太阳系</span>探索者</div>
      <div className="mode-tabs">
        {modes.map(m => (
          <button key={m.mode} className={state.currentMode === m.mode ? 'active' : ''} onClick={() => dispatch({ type: 'SET_MODE', payload: m.mode })}>{m.label}</button>
        ))}
      </div>
      <div className="right-actions">
        <button className={state.realisticScale ? 'active-btn' : ''} onClick={() => dispatch({ type: 'TOGGLE_REALISTIC_SCALE' })}>{state.realisticScale ? '演示比例' : '真实比例'}</button>
        <button onClick={onOpenAchievements}>成就 <span>{state.unlockedAchievements.size}/12</span></button>
      </div>
    </div>
  );
}
