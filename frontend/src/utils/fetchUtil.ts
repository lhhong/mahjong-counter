import { TypedAction } from "redoodle";
import { takeEveryPayload } from "./redoodleUtil";
import { call, put } from "@redux-saga/core/effects";
import { PostPayload, DeletePayload } from "../interfaces/fetch";

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

export function createGetWatcher<E>(
  fetchUrl: string,
  fetchAction: TypedAction.NoPayloadDefinition<any>,
  setAction: TypedAction.Definition<any, E>,
  transform: (resBody: any) => E = (resBody) => resBody,
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*() {
      try {
        const resBody = yield call(get, fetchUrl);
        yield put(setAction.create(transform(resBody)));
      } catch (err) {
        console.warn(err);
      }
    });
  };
}

export function createPostWatcher<D, F, E = any>(
  fetchAction: TypedAction.Definition<any, PostPayload<D, F>>,
  url: string | ((param: F | undefined) => string),
  setAction?: TypedAction.Definition<any, E>,
  transform: (resBody: any) => E = (resBody) => resBody,
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*(payload: PostPayload<D, F>) {
      const finalUrl = typeof url === "function" ? url(payload.urlParam) : url;
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

export function createDeleteWatcher<F>(
  fetchAction: TypedAction.Definition<any, DeletePayload<F>>,
  url: string | ((param: F | undefined) => string),
) {
  return function*() {
    yield takeEveryPayload(fetchAction.TYPE, function*(payload: DeletePayload<F>) {
      const finalUrl = typeof url === "function" ? url(payload.urlParam) : url;
      try {
        yield call(fetchDelete, finalUrl);
      } catch (err) {
        console.warn(err);
      }
    });
  };
}