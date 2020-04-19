import { TypedAction } from "redoodle";
import { GameSetup, Config } from "./state";
import { Players } from "../interfaces/players";
import { MJEvent } from "../interfaces/mjEvents";
import { PostPayload, DeletePayload, GetPayload } from "../interfaces/fetch";

export const NoopAction = TypedAction.defineWithoutPayload("no op")();

const UpdateGainsAction = TypedAction.define("logic // update gains")<Players<number>>();
const SetGainsAction = TypedAction.define("logic // set gains")<Players<number>>();
const NewEventAction = TypedAction.define("logic // new event")<MJEvent>();
const SetHistoryAction = TypedAction.define("logic // set history")<MJEvent[]>();
const ClearHistoryAction = TypedAction.defineWithoutPayload("logic // clear history")();

const SetGameSetupAction = TypedAction.define("config // set")<GameSetup>();
const SetConfigAction = TypedAction.define("config // set config")<Config>();
const SetPlayersAction = TypedAction.define("config // set players")<Players<string>>();

const GetConfig = TypedAction.define("get // config")<GetPayload<string>>();
const GetHistory = TypedAction.define("get // history")<GetPayload<string>>();

const PostNewEvent = TypedAction.define("post // new event")<PostPayload<MJEvent, string>>();
const PostSetGameSetup = TypedAction.define("post // set game setup")<PostPayload<GameSetup, string>>();

const DeleteAllHistory = TypedAction.define("delete // all history")<DeletePayload<string>>();
const DeleteEvent = TypedAction.define("delete // event")<DeletePayload<{ rid?: string, tid?: string }>>();

const UpdatesStartWatch = TypedAction.define("updates // start watch")<string>();
const UpdatesStopWatch = TypedAction.defineWithoutPayload("updates // stop watch")();
const UpdatesConfig = TypedAction.define("updates // config")<boolean>();
const UpdatesTx = TypedAction.define("updates // tx")<boolean>();

export const LogicActions = {
  updateGains: UpdateGainsAction,
  setGains: SetGainsAction,
  newEvent: NewEventAction,
  setHistory: SetHistoryAction,
  clearHistory: ClearHistoryAction,
}

export const GameSetupActions = {
  set: SetGameSetupAction,
  setConfig: SetConfigAction,
  setPlayers: SetPlayersAction,
}

export const GetActions = {
  config: GetConfig,
  history: GetHistory,
}

export const PostActions = {
  newEvent: PostNewEvent,
  setGameSetup: PostSetGameSetup,
}

export const DeleteActions = {
  allHistory: DeleteAllHistory,
  event: DeleteEvent,
}

export const UpdatesAction = {
  startWatch: UpdatesStartWatch,
  stopWatch: UpdatesStopWatch,
  config: UpdatesConfig,
  tx: UpdatesTx,
}
