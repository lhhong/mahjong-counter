import { all, spawn } from "@redux-saga/core/effects";
import { logicSaga } from "./logic/saga";

export function* rootSaga() {
  yield all([spawn(logicSaga)]);
}
