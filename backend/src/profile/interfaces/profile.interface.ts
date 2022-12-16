export interface ProfileInterface {
  id: number,
  email: string,
  displayName: string,
  imageUrl: string,
  blockedUserIds: number[],
  friends: number[],
  matching: boolean,
  inGame: boolean,
  victories: number,
  log: boolean,
}