import { TypedAction } from "redoodle";
import { GameSetup } from "./state";
import { Players } from "../interfaces/players";
import { MJEvent } from "../interfaces/mjEvents";

export const NoopAction = TypedAction.defineWithoutPayload("no op")();

const UpdateGainsAction = TypedAction.define("logic // update gains")<Players<number>>();
const SetGainsAction = TypedAction.define("logic // set gains")<Players<number>>();
const NewEventAction = TypedAction.define("logic // new event")<MJEvent>();

const SetGameSetupAction = TypedAction.define("config // set")<GameSetup>();

export const LogicActions = {
  updateGains: UpdateGainsAction,
  setGains: SetGainsAction,
  newEvent: NewEventAction,
}

export const GameSetupActions = {
  set: SetGameSetupAction,
}