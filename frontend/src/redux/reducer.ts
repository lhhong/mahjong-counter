import { combineReducers, setWith, TypedReducer } from "redoodle";
import { LogicActions, GameSetupActions } from "./actions";
import { RootState, GameSetup, Results } from "./state";

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

export const INITIAL_ROOT_STATE: RootState = {
  gameSetup: INITIAL_GAME_SETUP,
  results: INITIAL_RESULTS_STATE,
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

export const rootReducer = combineReducers<RootState>({
  results: resultsReducer,
  gameSetup: gameSetupReducer,
});
