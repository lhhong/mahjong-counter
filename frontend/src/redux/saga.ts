import { createPostWatcher, createDeleteWatcher, createGetWatcher } from "../utils/fetchUtil";
import { PostActions, DeleteActions, UpdatesAction, GetActions, GameSetupActions, LogicActions } from "./actions";
import { all, call, cancel, fork, put, race, spawn, take, takeEvery } from "@redux-saga/core/effects";
import { eventChannel, EventChannel } from "redux-saga";
import { takePayload } from "../utils/redoodleUtil";

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
    const roomId: string = yield takePayload(UpdatesAction.startWatch.TYPE);
    const socket: WebSocket = yield call(createSocketConnection, roomId);
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
    spawn(createPostWatcher(PostActions.setGameSetup, (roomId) => `/api/room/${roomId}/config`)),
    spawn(createPostWatcher(PostActions.newEvent, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDeleteWatcher(DeleteActions.allHistory, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDeleteWatcher(DeleteActions.event, (param) => `/api/room/${param?.rid}/tx/${param?.tid}`)),
    spawn(createGetWatcher(GetActions.config, (roomId) => `/api/room/${roomId}/config`, GameSetupActions.set)),
    spawn(createGetWatcher(GetActions.history, (roomId) => `/api/room/${roomId}/tx`, LogicActions.setHistory)),
  ]);
}
