import { useEffect, useRef, useState } from 'react';
import { TIMELINE_EVENTS } from '../../data/timeline';
import { PLANETS } from '../../data/planets';
import { useApp } from '../../store/AppContext';

export default function TimelineView() {
  const { focusOnPlanet, dispatch } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const scroll = scrollRef.current; if (!scroll) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        (e.target as HTMLElement).classList.toggle('visible', e.isIntersecting);
        if (e.isIntersecting) { const idx = parseInt((e.target as HTMLElement).dataset.idx || '0'); setActiveIdx(idx); }
      });
    }, { root: scroll, threshold: 0.4 });
    scroll.querySelectorAll('.tl-node').forEach(n => observer.observe(n));
    setTimeout(() => { const first = scroll.querySelector('.tl-node'); if (first) first.classList.add('visible'); }, 100);
    return () => observer.disconnect();
  }, []);

  const ev = TIMELINE_EVENTS[activeIdx]; const p = PLANETS[ev.planetIdx];

  return (<>
    <div id="tl-scroll" ref={scrollRef}>
      <div className="tl-line">
        {TIMELINE_EVENTS.map((ev2, i) => (
          <div key={i} className="tl-node" data-idx={i} onClick={() => focusOnPlanet(ev2.planetIdx)}>
            <div className="tl-era">{ev2.era}</div><div className="tl-title">{ev2.title}</div><div className="tl-desc">{ev2.desc}</div><div className="tl-tag">{ev2.tag}</div>
          </div>
        ))}
      </div>
    </div>
    <div id="tl-sidebar">
      <h3>当前事件</h3>
      <div>
        <div className="tl-mini-card highlight"><div className="tmc-title">{ev.title}</div><div className="tmc-desc">{ev.desc}</div></div>
        <div className="tl-mini-card"><div className="tmc-title">相关天体: {p.name}</div><div className="tmc-desc">{p.type} · 直径 {p.info.diameter}<br />{p.funFacts[0]}</div></div>
        <div style={{marginTop:'12px'}}><button className="lab-btn" onClick={() => { dispatch({ type: 'SET_MODE', payload: 'explore' }); focusOnPlanet(ev.planetIdx); }}>在3D中查看 {p.name} →</button></div>
      </div>
    </div>
  </>);
}
