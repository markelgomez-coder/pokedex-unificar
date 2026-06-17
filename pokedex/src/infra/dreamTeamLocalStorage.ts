import type { DreamTeamStorage } from "../domain/ports/storage";

const STORAGE_KEY = "dream-team";
const CURRENT_VERSION = 1;

export const dreamTeamStorage: DreamTeamStorage = {
  get(): number[] | null {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    try {
      const parsed = JSON.parse(v);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === "number"))
          return parsed;

        if (
          parsed.version === CURRENT_VERSION &&
          Array.isArray(parsed.data) &&
          parsed.data.every((x: unknown) => typeof x === "number")
        ) {
          return parsed.data as number[];
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  set(ids: number[]): void {
    const payload = { version: CURRENT_VERSION, data: ids };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },
};
