import { take, takeEvery } from "@redux-saga/core/effects";
import { TypedActionString } from "redoodle";

export function takeEveryPayload<T, E extends string = string>(
  action: TypedActionString<T, E>,
  worker: (payload: T) => any,
) {
  return takeEvery(action, ({ payload }: { type: E, payload: T }) => worker(payload));
}

export function takePayload<T, E extends string = string>(
  action: TypedActionString<T, E>,
) {
  return take(action).payload;
}
