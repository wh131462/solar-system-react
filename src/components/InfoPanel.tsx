import { useState } from 'react';
import { PLANETS } from '../data/planets';
import { useApp } from '../store/AppContext';
import type { InfoTab } from '../store/AppContext';

const INFO_LABELS: Record<string, string> = {
  diameter: '直径', mass: '质量', orbit: '公转周期', distSun: '距太阳',
  gravity: '表面重力', moons: '卫星数', type: '类型', temp: '温度', age: '年龄', atmosphere: '大气',
};

const tabs: { id: InfoTab; label: string }[] = [
  { id: 'data', label: '数据' }, { id: 'facts', label: '趣知识' }, { id: 'history', label: '探索史' }, { id: 'quiz', label: '问答' },
];

export default function InfoPanel() {
  const { state, dispatch } = useApp();
  const [answered, setAnswered] = useState<Record<string, number>>({});

  if (state.selectedPlanet < 0 || state.currentMode === 'knowledge') return <div id="info-panel" className="hidden" />;

  const planet = PLANETS[state.selectedPlanet];
  const handleQuiz = (qi: number, oi: number) => {
    const key = `${state.selectedPlanet}-${qi}`;
    if (key in answered) return;
    setAnswered(prev => ({ ...prev, [key]: oi }));
    if (oi === planet.quiz[qi].ans) { dispatch({ type: 'INCREMENT_QUIZ' }); }
  };

  return (
    <div id="info-panel">
      <div className="info-header">
        <h2>{planet.name} {planet.nameEn}</h2>
        <div className="subtitle">{planet.type}{planet.moons ? ` · ${planet.moons.length}颗卫星` : ''}</div>
      </div>
      <div className="info-tabs">
        {tabs.map(t => (<button key={t.id} className={state.infoTab === t.id ? 'active' : ''} onClick={() => dispatch({ type: 'SET_INFO_TAB', payload: t.id })}>{t.label}</button>))}
      </div>
      <div className="info-content">
        {state.infoTab === 'data' && (<>
          {Object.entries(planet.info).map(([k, v]) => (<div className="stat-row" key={k}><span className="label">{INFO_LABELS[k] || k}</span><span className="value">{v}</span></div>))}
          <div className="stat-row"><span className="label">轨道倾角</span><span className="value">{planet.inclination}°</span></div>
          <div className="stat-row"><span className="label">自转轴倾斜</span><span className="value">{planet.axialTilt}°</span></div>
        </>)}
        {state.infoTab === 'facts' && planet.funFacts.map((f, i) => <div className="fun-fact" key={i}>{f}</div>)}
        {state.infoTab === 'history' && planet.milestones.map((m, i) => (<div className="milestone-item" key={i}><div className="year">{m.year}</div><div className="event">{m.event}</div></div>))}
        {state.infoTab === 'quiz' && planet.quiz.map((q, qi) => {
          const key = `${state.selectedPlanet}-${qi}`;
          const userAnswer = answered[key];
          const isAnswered = key in answered;
          return (<div className="quiz-box" key={qi}><div className="q-text">{q.q}</div>
            {q.opts.map((o, oi) => {
              let cls = 'q-opt';
              if (isAnswered) { if (oi === q.ans) cls += ' correct'; else if (oi === userAnswer) cls += ' wrong'; }
              return <button key={oi} className={cls} onClick={() => handleQuiz(qi, oi)} disabled={isAnswered}>{o}</button>;
            })}
          </div>);
        })}
      </div>
    </div>
  );
}
