export interface DreamTeamStorage {
  get(): string[] | null;
  set(names: string[]): void;
}
