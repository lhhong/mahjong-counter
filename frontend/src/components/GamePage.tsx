import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GameSetupActions, LogicActions } from "../redux/actions";
import { getConfig } from "../redux/selectors";
import { GameSetupView } from "./GameSetupView";
import { ActionView } from "./ActionView";
import { GainsView } from "./GainsView";
import { HistoryView } from "./HistoryView";
import { usePollApi } from "../utils/hooksUtil";
import { GameSetup } from "../redux/state";
import { MJEvent } from "../interfaces/mjEvents";

export const GamePage: FunctionComponent = () => {
  const { roomId } = useParams();

  const dispatch = useDispatch();
  const config = useSelector(getConfig);

  usePollApi<GameSetup>((resp) => {
    if (resp) {
      dispatch(GameSetupActions.set(resp))
    }
  }, `/api/room/${roomId}/config`);

  usePollApi<MJEvent[]>((resp) => {
    if (resp) {
      dispatch(LogicActions.setHistory(resp))
    }
  }, `/api/room/${roomId}/tx`);

  return <>{roomId ?
    <div>
        <GameSetupView />
        {config.factor !== 0 && <>
          <ActionView />
          <GainsView />
          <HistoryView />
        </>}
    </div>
    :
    <div>An error has occured</div>
  }</>
}