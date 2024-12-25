import { MyEvent, Comment } from "./MyEvent";
import { User } from "../../profile/interfaces/user";

export interface EventsResponse {
  events: MyEvent[];
  more: boolean;
  page: number;
  count: number;
}

export interface SingleEventResponse {
  event: MyEvent;
}

export interface UsersResponse {
  users: User[];
}

export interface CommentsResponse {
    comments: Comment[];
}