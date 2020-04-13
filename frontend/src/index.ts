import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redoodle";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { App } from "./App";
import { INITIAL_ROOT_STATE, rootReducer } from "./redux/reducer";
import { rootSaga } from "./redux/saga";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  INITIAL_ROOT_STATE,
  applyMiddleware(sagaMiddleware) as any,
);
sagaMiddleware.run(rootSaga);

render(React.createElement(Provider, { store: store as any },
  React.createElement(App)), document.getElementById("root"));
