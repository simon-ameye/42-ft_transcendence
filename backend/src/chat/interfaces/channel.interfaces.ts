import { MessageInterface } from "./message.interface";

export interface	ChannelInterface {
	id: number,
	name: string,
  mode: string,
  //messages: string[],
  //authors: string[],
  //dates: string[],
  messages: MessageInterface[],
  isProtected :boolean,
  userSocketId :string,
}