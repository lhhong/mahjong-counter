import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redoodle";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { PersistGate } from 'redux-persist/integration/react';
import { App } from "./App";
import { INITIAL_ROOT_STATE, rootReducer } from "./redux/reducer";
import { rootSaga } from "./redux/saga";

const sagaMiddleware = createSagaMiddleware();

// const persistingReducer = persistReducer({ key: 'root', storage }, rootReducer as any);

const store = createStore(
  rootReducer,
  INITIAL_ROOT_STATE as any,
  applyMiddleware(sagaMiddleware) as any,
);
sagaMiddleware.run(rootSaga);

// const persistor = persistStore(store as any);

render(React.createElement(Provider, { store: store as any },
  // React.createElement(PersistGate, { loading: null, persistor },
    React.createElement(App)), document.getElementById("root"));
