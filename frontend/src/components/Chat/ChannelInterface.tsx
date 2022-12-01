
export default interface ChannelInterface {
  id: number,
  name: string,
  mode: string,
  messages: string[],
  authors: string[],
  dates: string[],
  isProtected: boolean,
  userSocketId: string,
}