import { Players, Seat } from "../interfaces/players";

export type PlayerMapper<S, T, R> = (arg1: S, arg2: T) => R;

export function sumPlayers(args: Players<number>[]): Players<number> {
  return args.reduceRight((arg1, arg2) => ({
    dong: arg1.dong + arg2.dong,
    nan: arg1.nan + arg2.nan,
    xi: arg1.xi + arg2.xi,
    bei: arg1.bei + arg2.bei,
  }));
}

export function mapPlayers<S, T, R>(
  arg1: Players<S>,
  arg2: Players<T>,
  mapper: PlayerMapper<S, T, R>,
): Players<R> {
  return {
    dong: mapper(arg1.dong, arg2.dong),
    nan: mapper(arg1.nan, arg2.nan),
    xi: mapper(arg1.xi, arg2.xi),
    bei: mapper(arg1.bei, arg2.bei),
  }
}

export function createPlayers<S>(defaultVal: S, excepts: { seat: Seat, value: S }[]): Players<S> {
  const players = {
    dong: defaultVal,
    nan: defaultVal,
    xi: defaultVal,
    bei: defaultVal,
  };
  for (const e of excepts) {
    players[e.seat] = e.value;
  }
  return players;
}
