import { all, spawn } from "@redux-saga/core/effects";
import { createPostWatcher, createDeleteWatcher } from "../utils/fetchUtil";
import { PostActions, DeleteActions } from "./actions";

export function* rootSaga() {
  yield all([
    spawn(createPostWatcher(PostActions.setGameSetup, (roomId) => `/api/room/${roomId}/config`)),
    spawn(createPostWatcher(PostActions.newEvent, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDeleteWatcher(DeleteActions.allHistory, (roomId) => `/api/room/${roomId}/tx`)),
    spawn(createDeleteWatcher(DeleteActions.event, (param) => `/api/room/${param?.rid}/tx/${param?.tid}`)),
  ]);
}
