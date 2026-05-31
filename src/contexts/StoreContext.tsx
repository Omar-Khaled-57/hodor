/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import initialMock from '@/data/mock.json';
import { useLocale } from '@/contexts/LocaleContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Student {
  uid: string;
  id: string;
  nameAR: string;
  nameEN: string;
  percentage: number;
  scannedAt: string | null;
  allowSelfEdit: boolean;
}

export interface Lecture {
  id: string;
  name: string;
  nameAR: string;
  startedAt: string;
  endedAt: string | null;
  attendees: string[]; // student UIDs
}

interface StoreState {
  students: Student[];
  lectures: Lecture[];
  activeLectureId: string | null;
  /** UIDs newly scanned in this session — used for entrance animation */
  recentScans: string[];
  globalAllowSelfEdit: boolean;
  /** Last UID that was scanned but not found in the system */
  lastUnknownUid: string | null;
  /** Whether simulation mode is active */
  simulationActive: boolean;
  /** UIDs scanned during the current simulation session */
  simulatedScans: string[];
  /** Whether the simulation banner was dismissed by the user */
  simBannerHidden: boolean;
}

type Action =
  | { type: 'ADD_STUDENT'; student: Student }
  | { type: 'EDIT_STUDENT'; uid: string; patch: Partial<Student> }
  | { type: 'DELETE_STUDENT'; uid: string }
  | { type: 'START_LECTURE'; lecture: Lecture }
  | { type: 'FINISH_LECTURE'; id: string; endedAt: string }
  | { type: 'SCAN_STUDENT'; lectureId: string; uid: string; scannedAt: string }
  | { type: 'CLEAR_RECENT_SCANS' }
  | { type: 'TOGGLE_GLOBAL_EDIT' }
  | { type: 'UNKNOWN_SCAN'; uid: string }
  | { type: 'CLEAR_UNKNOWN_UID' }
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'HIDE_SIM_BANNER' }
  | { type: 'SHOW_SIM_BANNER' }
  | { type: 'HYDRATE'; payload: Partial<StoreState> };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };

    case 'ADD_STUDENT':
      return { ...state, students: [action.student, ...state.students] };

    case 'EDIT_STUDENT':
      return {
        ...state,
        students: state.students.map(s =>
          s.uid === action.uid ? { ...s, ...action.patch } : s,
        ),
      };

    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(s => s.uid !== action.uid),
        lectures: state.lectures.map(l => ({
          ...l,
          attendees: l.attendees.filter(uid => uid !== action.uid),
        })),
      };

    case 'START_LECTURE':
      // Enforce single active lecture
      if (state.activeLectureId) return state;
      return {
        ...state,
        lectures: [action.lecture, ...state.lectures],
        activeLectureId: action.lecture.id,
        recentScans: [],
      };

    case 'FINISH_LECTURE':
      return {
        ...state,
        lectures: state.lectures.map(l =>
          l.id === action.id ? { ...l, endedAt: action.endedAt } : l,
        ),
        activeLectureId: null,
        recentScans: [],
      };

    case 'SCAN_STUDENT': {
      const alreadyIn = state.lectures
        .find(l => l.id === action.lectureId)
        ?.attendees.includes(action.uid);
      if (alreadyIn) return state;
      return {
        ...state,
        students: state.students.map(s =>
          s.uid === action.uid ? { ...s, scannedAt: action.scannedAt } : s,
        ),
        lectures: state.lectures.map(l =>
          l.id === action.lectureId
            ? { ...l, attendees: [...l.attendees, action.uid] }
            : l,
        ),
        recentScans: [action.uid, ...state.recentScans],
        simulatedScans:
          state.simulationActive && !state.simulatedScans.includes(action.uid)
            ? [...state.simulatedScans, action.uid]
            : state.simulatedScans,
      };
    }

    case 'CLEAR_RECENT_SCANS':
      return { ...state, recentScans: [] };

    case 'TOGGLE_GLOBAL_EDIT':
      return { ...state, globalAllowSelfEdit: !state.globalAllowSelfEdit };

    case 'UNKNOWN_SCAN':
      return { ...state, lastUnknownUid: action.uid };

    case 'CLEAR_UNKNOWN_UID':
      return { ...state, lastUnknownUid: null };

    case 'START_SIMULATION':
      return { ...state, simulationActive: true, simulatedScans: [], simBannerHidden: false };

    case 'HIDE_SIM_BANNER':
      return { ...state, simBannerHidden: true };

    case 'SHOW_SIM_BANNER':
      return { ...state, simBannerHidden: false };

    case 'STOP_SIMULATION': {
      const scannedUids = state.simulatedScans;
      const cleanedLectures = state.lectures.map(l =>
        l.id === state.activeLectureId
          ? { ...l, attendees: l.attendees.filter(uid => !scannedUids.includes(uid)) }
          : l,
      );
      return {
        ...state,
        simulationActive: false,
        simulatedScans: [],
        lectures: cleanedLectures,
        recentScans: [],
      };
    }

    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

function buildInitialState(): StoreState {
  return {
    students: initialMock.students as Student[],
    lectures: initialMock.lectures as Lecture[],
    activeLectureId: null,
    recentScans: [],
    globalAllowSelfEdit: true,
    lastUnknownUid: null,
    simulationActive: false,
    simulatedScans: [],
    simBannerHidden: false,
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: StoreState;
  activeLecture: Lecture | null;
  addStudent: (student: Student) => void;
  editStudent: (uid: string, patch: Partial<Student>) => void;
  deleteStudent: (uid: string) => void;
  startLecture: (lecture: Lecture) => void;
  finishLecture: () => void;
  scanStudent: (uid: string) => void;
  toggleGlobalEdit: () => void;
  clearUnknownUid: () => void;
  simulationActive: boolean;
  simBannerHidden: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  hideSimBanner: () => void;
  showSimBanner: () => void;
}

const StoreContext = createContext<StoreContextValue>({
  state: { students: [], lectures: [], activeLectureId: null, recentScans: [], globalAllowSelfEdit: true, lastUnknownUid: null, simulationActive: false, simulatedScans: [], simBannerHidden: false },
  activeLecture: null,
  addStudent: () => { },
  editStudent: () => { },
  deleteStudent: () => { },
  startLecture: () => { },
  finishLecture: () => { },
  scanStudent: () => { },
  toggleGlobalEdit: () => { },
  clearUnknownUid: () => { },
  simulationActive: false,
  simBannerHidden: false,
  startSimulation: () => { },
  stopSimulation: () => { },
  hideSimBanner: () => { },
  showSimBanner: () => { },
});

// ─── Provider ─────────────────────────────────────────────────────────────────



export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { t, locale } = useLocale();

  // ─── Refs for interval callbacks ──────────────────────────────────────────
  const tRef = useRef(t);
  const localeRef = useRef(locale);
  const studentsRef = useRef(state.students);
  const simulatedScansRef = useRef(state.simulatedScans);
  const activeLectureIdRef = useRef(state.activeLectureId);

  // Keep refs in sync after each render
  useEffect(() => {
    tRef.current = t;
    localeRef.current = locale;
    studentsRef.current = state.students;
    simulatedScansRef.current = state.simulatedScans;
    activeLectureIdRef.current = state.activeLectureId;
  });

  const activeLecture =
    state.lectures.find(l => l.id === state.activeLectureId) ?? null;

  // Hydrate from localStorage on mount and listen to cross-tab storage events
  useEffect(() => {
    setIsMounted(true);
    const data = localStorage.getItem('hodor-store');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } catch (e) { }
    } else {
      // Legacy fallback
      const legacyId = localStorage.getItem('hodor-active-lecture');
      if (legacyId) {
        dispatch({ type: 'HYDRATE', payload: { activeLectureId: legacyId } });
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hodor-store' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          dispatch({ type: 'HYDRATE', payload: parsed });
        } catch (err) { }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Persist state to localStorage on changes (skip during simulation)
  useEffect(() => {
    if (!isMounted) return;
    if (state.simulationActive) return;
    localStorage.setItem('hodor-store', JSON.stringify({
      students: state.students,
      lectures: state.lectures,
      globalAllowSelfEdit: state.globalAllowSelfEdit,
      activeLectureId: state.activeLectureId,
    }));
  }, [state.students, state.lectures, state.globalAllowSelfEdit, state.activeLectureId, state.simulationActive, isMounted]);

  // Sync active attendees to backend for ESP8266 duplicate detection screen
  useEffect(() => {
    if (!isMounted) return;
    if (state.simulationActive) return;
    const attendees = activeLecture?.attendees || [];
    fetch('/api/sync_lecture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendees }),
    }).catch(() => {});
  }, [activeLecture?.attendees, state.simulationActive, isMounted]);

  // Hardware scanning / simulation interval
  useEffect(() => {
    if (!state.activeLectureId) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }

    if (state.simulationActive) {
      // ── Simulation mode: generate mock scans at realistic intervals ──
      const getDelay = () => 2500 + Math.random() * 4500;

      const tick = () => {
        const scans = simulatedScansRef.current;
        const allStudents = studentsRef.current;
        const lecId = activeLectureIdRef.current;
        if (!lecId) return;

        const available = allStudents.filter(s => !scans.includes(s.uid));
        const isUnknown = Math.random() < 0.08;

        if (isUnknown || available.length === 0) {
          const fakeUid = 'SIM_' + Math.random().toString(16).slice(2, 10).toUpperCase();
          dispatch({ type: 'UNKNOWN_SCAN', uid: fakeUid });
          toast.warning(`📡 ${localeRef.current === 'ar' ? 'بطاقة غير مسجلة' : 'Unknown Card: ' + fakeUid}`, {
            description: localeRef.current === 'ar' ? 'بطاقة محاكاة غير مسجلة.' : 'Simulated unregistered card.',
            duration: 3000,
          });
          return;
        }

        const idx = Math.floor(Math.random() * available.length);
        const student = available[idx];

        dispatch({
          type: 'SCAN_STUDENT',
          lectureId: lecId,
          uid: student.uid,
          scannedAt: new Date().toISOString(),
        });

        toast.success(`📡 ${localeRef.current === 'ar' ? student.nameAR : student.nameEN}`, {
          description: tRef.current.toastNewScan,
          duration: 2500,
        });
      };

      tick();
      intervalRef.current = setInterval(tick, getDelay());
    } else {
      // ── Real hardware polling ──
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/pending_scan';

      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) return;
          const data = await res.json();

          if (data && data.uid) {
            await fetch(apiUrl, { method: 'DELETE' });

            const attendees =
              state.lectures.find(l => l.id === state.activeLectureId)?.attendees ?? [];

            if (attendees.includes(data.uid)) {
              return;
            }

            const target = state.students.find(s => s.uid === data.uid);

            if (target) {
              dispatch({
                type: 'SCAN_STUDENT',
                lectureId: state.activeLectureId!,
                uid: target.uid,
                scannedAt: new Date().toISOString(),
              });
              toast.success(`📡 ${locale === 'ar' ? target.nameAR : target.nameEN}`, {
                description: t.toastNewScan,
                duration: 2500,
              });
            } else {
              dispatch({ type: 'UNKNOWN_SCAN', uid: data.uid });
              toast.warning(`📡 ${locale === 'ar' ? 'بطاقة غير مسجلة' : 'Unknown Card: ' + data.uid}`, {
                description: locale === 'ar' ? 'يجب تسجيل الطالب أولاً.' : 'Card not registered.',
                duration: 3000,
              });
            }
          }
        } catch (err) {
          // Silently ignore network errors during polling
        }
      }, 1500);
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeLectureId, state.simulationActive]);

  const addStudent = useCallback((student: Student) => {
    dispatch({ type: 'ADD_STUDENT', student });
  }, []);

  const editStudent = useCallback((uid: string, patch: Partial<Student>) => {
    dispatch({ type: 'EDIT_STUDENT', uid, patch });
  }, []);

  const deleteStudent = useCallback((uid: string) => {
    dispatch({ type: 'DELETE_STUDENT', uid });
  }, []);

  const startLecture = useCallback((lecture: Lecture) => {
    dispatch({ type: 'START_LECTURE', lecture });
  }, []);

  const finishLecture = useCallback(() => {
    if (!state.activeLectureId) return;
    dispatch({
      type: 'FINISH_LECTURE',
      id: state.activeLectureId,
      endedAt: new Date().toISOString(),
    });
  }, [state.activeLectureId]);

  const scanStudent = useCallback(
    (uid: string) => {
      if (!state.activeLectureId) return;
      dispatch({
        type: 'SCAN_STUDENT',
        lectureId: state.activeLectureId,
        uid,
        scannedAt: new Date().toISOString(),
      });
    },
    [state.activeLectureId],
  );

  const startSimulation = useCallback(() => {
    dispatch({ type: 'START_SIMULATION' });
    toast.success(`🧪 ${tRef.current.simulationEnabled}`, {
      description: tRef.current.simulationEnabledDesc,
      duration: 6000,
    });
  }, []);

  const stopSimulation = useCallback(() => {
    dispatch({ type: 'STOP_SIMULATION' });
  }, []);

  const hideSimBanner = useCallback(() => {
    dispatch({ type: 'HIDE_SIM_BANNER' });
  }, []);

  const showSimBanner = useCallback(() => {
    dispatch({ type: 'SHOW_SIM_BANNER' });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        activeLecture,
        addStudent,
        editStudent,
        deleteStudent,
        startLecture,
        finishLecture,
        scanStudent,
        toggleGlobalEdit: useCallback(() => dispatch({ type: 'TOGGLE_GLOBAL_EDIT' }), []),
        clearUnknownUid: useCallback(() => dispatch({ type: 'CLEAR_UNKNOWN_UID' }), []),
        simulationActive: state.simulationActive,
        simBannerHidden: state.simBannerHidden,
        startSimulation,
        stopSimulation,
        hideSimBanner,
        showSimBanner,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
