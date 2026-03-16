import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

export type AppMode = 'explore' | 'knowledge' | 'lab' | 'observe';
export type KVMode = 'cross' | 'cards' | 'size' | 'timeline';
export type InfoTab = 'data' | 'facts' | 'history' | 'quiz';

interface AppState {
  currentMode: AppMode;
  kvMode: KVMode;
  selectedPlanet: number;
  infoTab: InfoTab;
  visitedPlanets: Set<number>;
  unlockedAchievements: Set<string>;
  quizCorrect: number;
  hasCompared: boolean;
  hasUsedLab: boolean;
  maxSpeed: number;
  simTime: number;
  simSpeed: number;
  paused: boolean;
  realisticScale: boolean;
  showTrails: boolean;
  showGravity: boolean;
  labState: Record<string, { massMul: number; distMul: number; ecc: number }>;
  toastMessage: string;
}

type Action =
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_KV_MODE'; payload: KVMode }
  | { type: 'SELECT_PLANET'; payload: number }
  | { type: 'SET_INFO_TAB'; payload: InfoTab }
  | { type: 'VISIT_PLANET'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'INCREMENT_QUIZ' }
  | { type: 'SET_COMPARED' }
  | { type: 'SET_USED_LAB' }
  | { type: 'SET_MAX_SPEED'; payload: number }
  | { type: 'SET_SIM_TIME'; payload: number }
  | { type: 'SET_SIM_SPEED'; payload: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TOGGLE_REALISTIC_SCALE' }
  | { type: 'TOGGLE_TRAILS' }
  | { type: 'TOGGLE_GRAVITY' }
  | { type: 'UPDATE_LAB'; payload: { id: string; massMul: number; distMul: number; ecc: number } }
  | { type: 'RESET_LAB'; payload: string }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'DESELECT_PLANET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    case 'SET_KV_MODE':
      return { ...state, kvMode: action.payload };
    case 'SELECT_PLANET':
      return { ...state, selectedPlanet: action.payload, infoTab: 'data' };
    case 'SET_INFO_TAB':
      return { ...state, infoTab: action.payload };
    case 'VISIT_PLANET': {
      const visited = new Set(state.visitedPlanets);
      visited.add(action.payload);
      return { ...state, visitedPlanets: visited };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      const unlocked = new Set(state.unlockedAchievements);
      unlocked.add(action.payload);
      return { ...state, unlockedAchievements: unlocked };
    }
    case 'INCREMENT_QUIZ':
      return { ...state, quizCorrect: state.quizCorrect + 1 };
    case 'SET_COMPARED':
      return { ...state, hasCompared: true };
    case 'SET_USED_LAB':
      return { ...state, hasUsedLab: true };
    case 'SET_MAX_SPEED':
      return { ...state, maxSpeed: Math.max(state.maxSpeed, action.payload) };
    case 'SET_SIM_TIME':
      return { ...state, simTime: action.payload };
    case 'SET_SIM_SPEED':
      return { ...state, simSpeed: action.payload };
    case 'TOGGLE_PAUSE':
      return { ...state, paused: !state.paused };
    case 'TOGGLE_REALISTIC_SCALE':
      return { ...state, realisticScale: !state.realisticScale };
    case 'TOGGLE_TRAILS':
      return { ...state, showTrails: !state.showTrails };
    case 'TOGGLE_GRAVITY':
      return { ...state, showGravity: !state.showGravity };
    case 'UPDATE_LAB':
      return { ...state, labState: { ...state.labState, [action.payload.id]: { massMul: action.payload.massMul, distMul: action.payload.distMul, ecc: action.payload.ecc } } };
    case 'RESET_LAB':
      return { ...state, labState: { ...state.labState, [action.payload]: { massMul: 1, distMul: 1, ecc: 0 } } };
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload };
    case 'DESELECT_PLANET':
      return { ...state, selectedPlanet: -1 };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  focusOnPlanet: (idx: number) => void;
  sceneRef: React.MutableRefObject<any>;
}

const AppContext = createContext<AppContextType>(null!);

export function useApp() {
  return useContext(AppContext);
}

const initialLabState: Record<string, { massMul: number; distMul: number; ecc: number }> = {};
['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].forEach(id => {
  initialLabState[id] = { massMul: 1, distMul: 1, ecc: 0 };
});

const initialState: AppState = {
  currentMode: 'explore',
  kvMode: 'cross',
  selectedPlanet: -1,
  infoTab: 'data',
  visitedPlanets: new Set(),
  unlockedAchievements: new Set(),
  quizCorrect: 0,
  hasCompared: false,
  hasUsedLab: false,
  maxSpeed: 1,
  simTime: Date.now(),
  simSpeed: 1,
  paused: false,
  realisticScale: false,
  showTrails: false,
  showGravity: false,
  labState: initialLabState,
  toastMessage: '',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sceneRef = useRef<any>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let prevTime = performance.now();
    let animId = 0;
    function tick() {
      animId = requestAnimationFrame(tick);
      const now = performance.now();
      const delta = (now - prevTime) / 1000;
      prevTime = now;
      const st = stateRef.current;
      if (!st.paused) {
        dispatch({ type: 'SET_SIM_TIME', payload: st.simTime + delta * st.simSpeed * 86400000 });
      }
    }
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const focusOnPlanet = useCallback((idx: number) => {
    dispatch({ type: 'SELECT_PLANET', payload: idx });
    dispatch({ type: 'VISIT_PLANET', payload: idx });
    if (sceneRef.current?.focusOnPlanet) {
      sceneRef.current.focusOnPlanet(idx);
    }
  }, []);

  // 自动检查成就：state 变化时自动触发，避免 stale closure
  useEffect(() => {
    const checks: Record<string, () => boolean> = {
      visit_all: () => state.visitedPlanets.size >= 9,
      visit_sun: () => state.visitedPlanets.has(0),
      visit_earth: () => state.visitedPlanets.has(3),
      visit_saturn: () => state.visitedPlanets.has(6),
      visit_uranus: () => state.visitedPlanets.has(7),
      quiz_3: () => state.quizCorrect >= 3,
      quiz_10: () => state.quizCorrect >= 10,
      compare: () => state.hasCompared,
      lab: () => state.hasUsedLab,
      speed10: () => state.maxSpeed >= 10,
      all_moons: () => [3, 4, 5, 6, 8].every(i => state.visitedPlanets.has(i)),
      far_away: () => state.visitedPlanets.has(8),
    };

    ACHIEVEMENTS.forEach(a => {
      if (!state.unlockedAchievements.has(a.id) && checks[a.id]?.()) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: a.id });
        dispatch({ type: 'SHOW_TOAST', payload: '解锁成就: ' + a.name });
      }
    });
  }, [state.visitedPlanets, state.quizCorrect, state.hasCompared, state.hasUsedLab, state.maxSpeed]);

  return (
    <AppContext.Provider value={{ state, dispatch, focusOnPlanet, sceneRef }}>
      {children}
    </AppContext.Provider>
  );
}
