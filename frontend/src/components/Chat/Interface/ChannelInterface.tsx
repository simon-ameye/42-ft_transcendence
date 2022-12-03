import MessageInterface from "./MessageInterface";
import UserInterface from "../Interface/UserInterface";

export default interface ChannelInterface {
  id: number,
  name: string,
  mode: string,
  //messages: string[],
  //authors: string[],
  //dates: string[],
  messages: MessageInterface[],
  isProtected: boolean,
  userSocketId: string,
  users: UserInterface[],

}