import { combineReducers, setWith, TypedReducer } from "redoodle";
import { LogicActions, GameSetupActions, UpdatesAction } from "./actions";
import { RootState, GameSetup, Results, Updates } from "./state";

const INITIAL_GAME_SETUP: GameSetup = {
  players: {
    dong: "",
    nan: "",
    xi: "",
    bei: "",
  },
  config: {
    factor: 0,
    minTai: 0,
    maxTai: 0,
    shooter: false,
    sanLiu: false,
  },
};

const INITIAL_RESULTS_STATE: Results = {
  history: [],
};

const INITIAL_UPDATES_STATE: Updates = {
  config: false,
  tx: false,
}

export const INITIAL_ROOT_STATE: RootState = {
  gameSetup: INITIAL_GAME_SETUP,
  results: INITIAL_RESULTS_STATE,
  updates: INITIAL_UPDATES_STATE,
};

const resultsReducer = TypedReducer.builder<Results>()
  .withDefaultHandler((state = INITIAL_RESULTS_STATE, action) => state)
  .withHandler(LogicActions.newEvent.TYPE, (state, event) => {
    return setWith(state, { history: [event, ...state.history] });
  })
  .withHandler(LogicActions.setHistory.TYPE, (state, history) => {
    return setWith(state, { history });
  })
  .withHandler(LogicActions.clearHistory.TYPE, (state, event) => {
    return INITIAL_RESULTS_STATE;
  })
  .build();

const gameSetupReducer = TypedReducer.builder<GameSetup>()
  .withDefaultHandler((state = INITIAL_GAME_SETUP, action) => state)
  .withHandler(GameSetupActions.set.TYPE, (state, gameSetup) => {
    return gameSetup;
  })
  .withHandler(GameSetupActions.setConfig.TYPE, (state, config) => {
    return setWith(state, { config });
  })
  .withHandler(GameSetupActions.setPlayers.TYPE, (state, players) => {
    return setWith(state, { players });
  })
  .build();

const updatesReducer = TypedReducer.builder<Updates>()
  .withDefaultHandler((state = INITIAL_UPDATES_STATE, action) => state)
  .withHandler(UpdatesAction.config.TYPE, (state, config) => {
    return setWith(state, { config });
  })
  .withHandler(UpdatesAction.tx.TYPE, (state, tx) => {
    return setWith(state, { tx });
  })
  .withHandler(UpdatesAction.startWatch.TYPE, (state, roomId) => {
    return setWith(state, { watching: roomId });
  })
  .withHandler(UpdatesAction.stopWatch.TYPE, (state) => {
    return setWith(state, { watching: undefined });
  })
  .build()

export const rootReducer = combineReducers<RootState>({
  results: resultsReducer,
  gameSetup: gameSetupReducer,
  updates: updatesReducer,
});
