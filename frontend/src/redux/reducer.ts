import { combineReducers, setWith, TypedReducer } from "redoodle";
import { LogicActions, GameSetupActions } from "./actions";
import { RootState, GameSetup, Results } from "./state";
import { sumPlayers } from "../utils/playersUtil";

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
  gains: {
    dong: 0,
    nan: 0,
    xi: 0,
    bei: 0,
  },
};

export const INITIAL_ROOT_STATE: RootState = {
  gameSetup: INITIAL_GAME_SETUP,
  results: INITIAL_RESULTS_STATE,
};

const resultsReducer = TypedReducer.builder<Results>()
  .withDefaultHandler((state = INITIAL_RESULTS_STATE, action) => state)
  .withHandler(LogicActions.updateGains.TYPE, (state, gains) => {
    return setWith(state, { gains: sumPlayers([state.gains, gains]) });
  })
  .withHandler(LogicActions.setGains.TYPE, (state, gains) => {
    return setWith(state, { gains });
  })
  .withHandler(LogicActions.newEvent.TYPE, (state, event) => {
    return setWith(state, { history: [event, ...state.history] })
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
  .build();

export const rootReducer = combineReducers<RootState>({
  results: resultsReducer,
  gameSetup: gameSetupReducer,
});
