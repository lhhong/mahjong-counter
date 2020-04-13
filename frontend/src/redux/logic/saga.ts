import { all, put, select, spawn, takeEvery } from "@redux-saga/core/effects";
import { LogicActions, GameSetupActions } from "../actions";
import { Config } from "../state";
import { getConfig, getHistory } from "../selectors";
import { eventToGains } from "../../logic/logic";
import { MJEvent } from "../../interfaces/mjEvents";
import { sumPlayers } from "../../utils/playersUtil";

function* recalculateGains() {
    const config: Config = yield select(getConfig);
    const history: MJEvent[] = yield select(getHistory);
    if (history.length > 0) {
      const finalGains = sumPlayers(history.map(event => eventToGains(event, config)));
      yield put(LogicActions.setGains.create(finalGains));
    }
}

function* watchNewEvent() {
  yield takeEvery(LogicActions.newEvent.TYPE, recalculateGains);
}

function* watchConfigChange() {
  yield takeEvery(GameSetupActions.set.TYPE, recalculateGains);
}

export function* logicSaga() {
  yield all([
    spawn(watchNewEvent),
    spawn(watchConfigChange),
  ]);
}
