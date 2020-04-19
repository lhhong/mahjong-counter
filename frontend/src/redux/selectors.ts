import { createSelector } from "reselect";
import { RootState } from "./state";

export const getRootState = (state: RootState ) => {
  return state
};

export const getGameSetup = createSelector(getRootState,
  (rootState) => rootState.gameSetup);
export const getConfig = createSelector(getGameSetup,
  (gameSetup) => gameSetup.config);
export const getPlayers = createSelector(getGameSetup,
  (gameSetup) => gameSetup.players);

export const getResults = createSelector(getRootState,
  (rootState) => rootState.results);
export const getHistory = createSelector(getResults,
  (results) => results.history);

export const getUpdates = createSelector(getRootState,
  (rootState) => rootState.updates);

export const getApp = createSelector(getRootState,
  (rootState) => rootState.app);
export const getRoomId = createSelector(getApp,
  (app) => app.roomId);