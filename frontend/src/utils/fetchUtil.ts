import { TypedAction } from "redoodle";
import { takeEveryPayload } from "./redoodleUtil";
import { call, put, select } from "@redux-saga/core/effects";
import { PostPayload, DeletePayload, GetPayload } from "../interfaces/fetch";
import { Selector } from "reselect";

export function get(url: string): Promise<any> {
  return getBodyPromise(fetch(url));
}

export function post(url: string, data: any): Promise<any> {
  return getBodyPromise(fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }));
}

export function fetchDelete(url: string): Promise<any> {
  return getBodyPromise(fetch(url, {
    method: "DELETE",
  }));
}

function getBodyPromise(respPromise: Promise<Response>): Promise<any> {
  return new Promise((resolve, reject) => {
    respPromise.then((resp) => {
      if (!resp.ok) {
        reject(resp.status);
      } else {
        if (resp.status === 204 || resp.status === 201) {
          resolve();
        } else {
          resp.json()
          .then((body) => resolve(body))
          .catch(() => {
            console.warn("Cannot resolve response as json");
            console.warn(`Status code ${resp.status} not returning json?`);
            // Assumes request suceeded regardless
            resolve();
          });
        }
      }
    });
  });
}

export function createGetWatcher<F, E, G>(
  fetchAction: TypedAction.Definition<any, GetPayload<F>>,
  url: string | ((stateParam: G | undefined, actionParam: F | undefined) => string),
  setAction: TypedAction.Definition<any, E>,
  paramSelector?: Selector<any, G>,
  transform: (resBody: any) => E = (resBody) => resBody,
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*(payload: GetPayload<F>) {
      const stateParam = paramSelector ? yield select(paramSelector) : undefined;
      const finalUrl = typeof url === "function" ? url(stateParam, payload.urlParam) : url;
      try {
        const resBody = yield call(get, finalUrl);
        if (resBody !== undefined) {
          yield put(setAction.create(transform(resBody)));
        }
      } catch (err) {
        console.warn(err);
      }
    });
  };
}

export function createPostWatcher<D, F, G, E = any>(
  fetchAction: TypedAction.Definition<any, PostPayload<D, F>>,
  url: string | ((stateParam: G | undefined, actionParam: F | undefined) => string),
  paramSelector?: Selector<any, G>,
  setAction?: TypedAction.Definition<any, E>,
  transform: (resBody: any) => E = (resBody) => resBody,
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*(payload: PostPayload<D, F>) {
      const stateParam = paramSelector ? yield select(paramSelector) : undefined;
      const finalUrl = typeof url === "function" ? url(stateParam, payload.urlParam) : url;
      try {
        const resBody = yield call(post, finalUrl, payload.data);
        if (setAction) {
          yield put(setAction.create(transform(resBody)));
        }
      } catch (err) {
        console.warn(err);
      }
    });
  };
}

export function createDeleteWatcher<F, G>(
  fetchAction: TypedAction.Definition<any, DeletePayload<F>>,
  url: string | ((stateParam: G | undefined, actionParam: F | undefined) => string),
  paramSelector?: Selector<any, G>,
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*(payload: DeletePayload<F>) {
      const stateParam = paramSelector ? yield select(paramSelector) : undefined;
      const finalUrl = typeof url === "function" ? url(stateParam, payload.urlParam) : url;
      try {
        yield call(fetchDelete, finalUrl);
      } catch (err) {
        console.warn(err);
      }
    });
  };
}