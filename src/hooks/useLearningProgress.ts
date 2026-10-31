import { useCallback, useEffect, useState } from "react";
import type { LearningMode, ModuleId, ProgressRecord } from "@/types/learning";

const KEY = "techsaathi.progress";
const EVENT = "techsaathi-progress";

export interface ProgressStore {
  lastVisited: { moduleId: ModuleId; mode: LearningMode } | null;
  records: ProgressRecord[];
}

const empty: ProgressStore = { lastVisited: null, records: [] };

export function readProgress(): ProgressStore {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as ProgressStore;
    return { lastVisited: parsed.lastVisited ?? null, records: Array.isArray(parsed.records) ? parsed.records : [] };
  } catch {
    return empty;
  }
}

function write(store: ProgressStore) {
  window.localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(EVENT));
}

export function useLearningProgress() {
  const [store, setStore] = useState<ProgressStore>(empty);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setStore(readProgress());
    sync();
    setLoaded(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markVisited = useCallback((moduleId: ModuleId, mode: LearningMode) => {
    write({ ...readProgress(), lastVisited: { moduleId, mode } });
  }, []);

  const saveRecord = useCallback((record: ProgressRecord) => {
    const cur = readProgress();
    write({ ...cur, records: [...cur.records, record].slice(-50) });
  }, []);

  const clear = useCallback(() => write(empty), []);

  const latestFor = useCallback(
    (moduleId: ModuleId) => [...store.records].reverse().find((r) => r.moduleId === moduleId) ?? null,
    [store.records],
  );

  return { store, loaded, markVisited, saveRecord, clear, latestFor };
}
