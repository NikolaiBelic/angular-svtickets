import { MyEvent } from "./MyEvent";

export interface EventsResponse {
  events: MyEvent[];
  more: boolean;
  page: number;
  count: number;
}

export interface SingleEventResponse {
  event: MyEvent;
}