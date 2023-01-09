type matchHistory = {
  date: string;
  score: number[];
  opponent: string;
}

export interface ProfileInterface {
  id: number,
  displayName: string,
  matching: boolean,
  inGame: boolean,
  victories: number,
  log: boolean,
  matchHistory: matchHistory[],
}