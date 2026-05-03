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
      };
    }

    case 'CLEAR_RECENT_SCANS':
      return { ...state, recentScans: [] };

    case 'TOGGLE_GLOBAL_EDIT':
      return { ...state, globalAllowSelfEdit: !state.globalAllowSelfEdit };

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
}

const StoreContext = createContext<StoreContextValue>({
  state: { students: [], lectures: [], activeLectureId: null, recentScans: [], globalAllowSelfEdit: true },
  activeLecture: null,
  addStudent: () => {},
  editStudent: () => {},
  deleteStudent: () => {},
  startLecture: () => {},
  finishLecture: () => {},
  scanStudent: () => {},
  toggleGlobalEdit: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

const MOCK_SCAN_INTERVAL = 8000; // ms

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { t, locale } = useLocale();

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
      } catch (e) {}
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
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hodor-store', JSON.stringify({
      students: state.students,
      lectures: state.lectures,
      globalAllowSelfEdit: state.globalAllowSelfEdit,
      activeLectureId: state.activeLectureId,
    }));
  }, [state.students, state.lectures, state.globalAllowSelfEdit, state.activeLectureId, isMounted]);

  // Auto-mock interval: scan a random student not yet in active lecture
  useEffect(() => {
    if (!state.activeLectureId) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const attendees =
        state.lectures.find(l => l.id === state.activeLectureId)?.attendees ?? [];
      const unscanned = state.students.filter(s => !attendees.includes(s.uid));
      if (unscanned.length === 0) {
        clearInterval(intervalRef.current!);
        return;
      }
      const target = unscanned[Math.floor(Math.random() * unscanned.length)];
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
    }, MOCK_SCAN_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeLectureId]);

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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
