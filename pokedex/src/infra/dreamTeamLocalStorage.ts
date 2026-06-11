import type { DreamTeamStorage } from "../domain/ports/storage";

export const dreamTeamStorage: DreamTeamStorage = {
  get(): string[] | null {
    const v = localStorage.getItem("dream-team");
    if (!v) return null;
    try {
      const names = JSON.parse(v);
      return Array.isArray(names) ? names : null;
    } catch {
      return null;
    }
  },
  set(names: string[]): void {
    localStorage.setItem("dream-team", JSON.stringify(names));
  },
};
