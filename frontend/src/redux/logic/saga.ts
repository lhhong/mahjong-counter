import { all, put, select, spawn, takeEvery } from "@redux-saga/core/effects";
import { LogicActions, GameSetupActions, PostActions, DeleteActions } from "../actions";
import { Config } from "../state";
import { getConfig, getHistory } from "../selectors";
import { eventToGains } from "../../logic/logic";
import { MJEvent } from "../../interfaces/mjEvents";
import { sumPlayers } from "../../utils/playersUtil";
import { createDefaultPostWatcher, createDefaultDeleteWatcher } from "../../utils/fetchUtil";

function* recalculateGains() {
    const config: Config = yield select(getConfig);
    const history: MJEvent[] = yield select(getHistory);
    if (history.length > 0) {
      const finalGains = sumPlayers(history.map(event => eventToGains(event, config)));
      yield put(LogicActions.setGains.create(finalGains));
    }
}

function* watchSetHistory() {
  yield takeEvery(LogicActions.setHistory.TYPE, recalculateGains);
}

function* watchSetGameSetup() {
  yield takeEvery(GameSetupActions.set.TYPE, recalculateGains);
}

export function* logicSaga() {
  yield all([
    spawn(watchSetHistory),
    spawn(watchSetGameSetup),
    spawn(createDefaultPostWatcher(PostActions.setGameSetup, (roomId) => `/api/room/${roomId}/config`)),
    spawn(createDefaultPostWatcher(PostActions.newEvent, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDefaultDeleteWatcher(DeleteActions.allHistory, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDefaultDeleteWatcher(DeleteActions.event, (param) => `/api/room/${param?.rid}/tx/${param?.tid}`)),
  ]);
}
