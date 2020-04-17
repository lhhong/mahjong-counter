import { TypedAction } from "redoodle";
import { GameSetup } from "./state";
import { Players } from "../interfaces/players";
import { MJEvent } from "../interfaces/mjEvents";

export const NoopAction = TypedAction.defineWithoutPayload("no op")();

const UpdateGainsAction = TypedAction.define("logic // update gains")<Players<number>>();
const SetGainsAction = TypedAction.define("logic // set gains")<Players<number>>();
const NewEventAction = TypedAction.define("logic // new event")<MJEvent>();
const ClearHistoryAction = TypedAction.defineWithoutPayload("logic // clear history")();

const SetGameSetupAction = TypedAction.define("config // set")<GameSetup>();

export const LogicActions = {
  updateGains: UpdateGainsAction,
  setGains: SetGainsAction,
  newEvent: NewEventAction,
  clearHistory: ClearHistoryAction,
}

export const GameSetupActions = {
  set: SetGameSetupAction,
}