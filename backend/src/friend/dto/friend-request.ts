import { User } from "@prisma/client";

export type friendRequest_Status = 'pending' | 'accepted' | 'declined' | 'blocked'

export class friendRequestStatus {
  status?: friendRequest_Status;
}

export class FriendRequest {
  creator?: User;
  receiver?: User;
  status?: friendRequestStatus;
}
