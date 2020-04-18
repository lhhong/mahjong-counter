import { Seat } from "./players";

export interface GaEvent {
  id?: string;
  event: "ga";
  anGa: boolean;
  completeSet: boolean;
  target: Seat;
  feeder?: Seat;
}

export interface GangEvent {
  id?: string;
  event: "gang";
  anGang: boolean;
  target: Seat;
  feeder?: Seat;
}

export interface HuEvent {
  id?: string;
  event: "hu";
  huType?: string;
  ziMo: boolean;
  target: Seat;
  feeder?: Seat;
  tai: number;
  yiPaoSanXiang: boolean;
  zhaHu: boolean;
}

export type MJEvent = GaEvent | GangEvent | HuEvent;
