import { Seat, Players } from "./players";

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

export interface ManualEvent {
  id?: string;
  event: "manual";
  gains: Players<number>;
}

export type RegularMJEvent = GaEvent | GangEvent | HuEvent;

export type MJEvent = RegularMJEvent | ManualEvent;
