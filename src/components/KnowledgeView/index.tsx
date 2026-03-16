

import { useApp } from '../../store/AppContext';
import type { KVMode } from '../../store/AppContext';
import CrossSection from './CrossSection';
import CardCarousel from './CardCarousel';
import SizeComparison from './SizeComparison';
import TimelineView from './TimelineView';

const kvTabs: { mode: KVMode; label: string }[] = [
  { mode: 'cross', label: '3D 剖面' },
  { mode: 'cards', label: '百科卡片' },
  { mode: 'size', label: '大小对比' },
  { mode: 'timeline', label: '时间线' },
];

export default function KnowledgeView() {
  const { state, dispatch } = useApp();
  if (state.currentMode !== 'knowledge') return null;

  return (
    <div id="knowledge-view" className="show">
      <div className="kv-nav">
        {kvTabs.map(t => (
          <button key={t.mode} className={state.kvMode === t.mode ? 'active' : ''}
            onClick={() => { dispatch({ type: 'SET_KV_MODE', payload: t.mode }); if (t.mode === 'size') { dispatch({ type: 'SET_COMPARED' }); } }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="kv-body">
        <div className={`kv-section${state.kvMode === 'cross' ? ' active' : ''}`} id="section-cross">{state.kvMode === 'cross' && <CrossSection />}</div>
        <div className={`kv-section${state.kvMode === 'cards' ? ' active' : ''}`} id="section-cards">{state.kvMode === 'cards' && <CardCarousel />}</div>
        <div className={`kv-section${state.kvMode === 'size' ? ' active' : ''}`} id="section-size">{state.kvMode === 'size' && <SizeComparison />}</div>
        <div className={`kv-section${state.kvMode === 'timeline' ? ' active' : ''}`} id="section-timeline">{state.kvMode === 'timeline' && <TimelineView />}</div>
      </div>
    </div>
  );
}
