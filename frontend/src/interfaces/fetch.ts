export interface PostPayload<T, S = {}> {
  data: T;
  urlParam?: S;
}

export interface DeletePayload<S = {}> {
  urlParam?: S;
}

export interface GetPayload<S = {}> {
  urlParam?: S;
}