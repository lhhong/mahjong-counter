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

export const getGains = createSelector(getResults,
  (results) => results.gains);
export const getHistory = createSelector(getResults,
  (results) => results.history);