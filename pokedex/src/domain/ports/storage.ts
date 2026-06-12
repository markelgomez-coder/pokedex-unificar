export interface DreamTeamStorage {
  get(): number[] | null;
  set(ids: number[]): void;
}
