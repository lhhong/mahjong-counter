import { createPostWatcher, createDeleteWatcher, createGetWatcher } from "../utils/fetchUtil";
import { PostActions, DeleteActions, UpdatesAction, GetActions, GameSetupActions, LogicActions } from "./actions";
import { all, call, put, race, select, spawn, take, takeEvery } from "@redux-saga/core/effects";
import { eventChannel, EventChannel } from "redux-saga";
import { getRoomId } from "./selectors";

function createSocketConnection(roomId: string) {
  const path = `/ws/${roomId}`;
  const { host } = window.location;
  const url = `ws://${host}${path}`;
  const socket = new WebSocket(url);
  return socket;
}

function createSocketChannel(socket: WebSocket): EventChannel<string> {
  return eventChannel<string>((emit) => {
    socket.onmessage = (ev) => {
      emit(ev.data);
    };

    const unsubscribe = () => {
      socket.onmessage = () => void 0;
    };
    return unsubscribe;
  });
}

function* watchMessageReceipt(socket: WebSocket) {
  const socketChannel: EventChannel<any> = yield call(createSocketChannel, socket);
  yield takeEvery(socketChannel, function*(msg: string) {
    if (msg === "config") {
      yield put(UpdatesAction.config(true));
    } if (msg === "tx") {
      yield put(UpdatesAction.tx(true));
    }
  });
}

export function* websocketSaga() {
  while (true) {
    yield take(UpdatesAction.startWatch.TYPE);
    const roomId: string = yield select(getRoomId);
    const socket: WebSocket = yield call(createSocketConnection, roomId);
    yield put(UpdatesAction.setWatching(roomId));
    yield race([
      take(UpdatesAction.stopWatch.TYPE),
      watchMessageReceipt(socket),
    ]);
    if (socket.readyState !== WebSocket.CLOSED || socket.readyState !== WebSocket.CLOSING) {
      socket.close();
    }
  }
}

export function* rootSaga() {
  yield all([
    spawn(websocketSaga),
    spawn(createPostWatcher(PostActions.setGameSetup, (roomId) => `/api/room/${roomId}/config`, getRoomId)),
    spawn(createPostWatcher(PostActions.newEvent, (roomId) => `/api/room/${roomId}/tx`, getRoomId)),
    spawn(createDeleteWatcher(DeleteActions.allHistory, (roomId) => `/api/room/${roomId}/tx`, getRoomId)),
    spawn(createDeleteWatcher(DeleteActions.event, (roomId, tid) => `/api/room/${roomId}/tx/${tid}`, getRoomId)),
    spawn(createGetWatcher(GetActions.config, (roomId) => `/api/room/${roomId}/config`, GameSetupActions.set, getRoomId)),
    spawn(createGetWatcher(GetActions.history, (roomId) => `/api/room/${roomId}/tx`, LogicActions.setHistory, getRoomId)),
  ]);
}
