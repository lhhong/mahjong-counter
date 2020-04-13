export enum Seat {
  DONG = "dong",
  NAN = "nan",
  XI = "xi",
  BEI = "bei",
}

export interface Players<T> {
  [Seat.DONG]: T;
  [Seat.NAN]: T;
  [Seat.XI]: T;
  [Seat.BEI]: T;
}
