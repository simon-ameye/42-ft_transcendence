export interface	ChannelInterface {
	id: number,
	name: string,
  mode: string,
  messages: string[],
  authors: string[],
  isProtected :boolean,
  userSocketId :string,
}