import { Seat } from "./players";

export interface GaEvent {
  event: "ga",
  anGa: boolean;
  completeSet: boolean;
  target: Seat;
  feeder?: Seat;
}

export interface GangEvent {
  event: "gang",
  anGang: boolean;
  target: Seat;
  feeder?: Seat;
}

export interface HuEvent {
  event: "hu",
  huType?: string,
  ziMo: boolean,
  target: Seat;
  feeder?: Seat;
  tai: number;
  yiPaoSanXiang: boolean;
  zhaHu: boolean;
}

export type MJEvent = GaEvent | GangEvent | HuEvent;
