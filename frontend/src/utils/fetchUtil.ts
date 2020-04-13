import { TypedAction } from "redoodle";
import { takeEveryPayload } from "./redoodleUtil";
import { call, put } from "@redux-saga/core/effects";

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

function getBodyPromise(respPromise: Promise<Response>): Promise<any> {
  return new Promise((resolve, reject) => {
    respPromise.then((resp) => {
      if (!resp.ok) {
        reject(resp.status);
      } else {
        if (resp.status === 204) {
          resolve(true);
        } else {
          resp.json()
          .then((body) => resolve(body))
          .catch(() => {
            console.warn("Cannot resolve response as json");
            console.warn(`Status code ${resp.status} not returning json?`);
            // Assumes request suceeded regardless
            resolve(true);
          });
        }
      }
    });
  });
}

export function createDefaultGetWatcher<E>(
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
