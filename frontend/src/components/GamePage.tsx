import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UpdatesAction, GetActions, GameSetupActions } from "../redux/actions";
import { getConfig, getUpdates } from "../redux/selectors";
import { GameSetupView } from "./GameSetupView";
import { ActionView } from "./ActionView";
import { GainsView } from "./GainsView";
import { HistoryView } from "./HistoryView";
import { useEffect } from "react";

export const GamePage: FunctionComponent = () => {
  const { roomId } = useParams();

  const dispatch = useDispatch();
  const config = useSelector(getConfig);
  const updates = useSelector(getUpdates);

  useEffect(() => {
    dispatch(GameSetupActions.setRoomId(roomId));
    if (roomId) {
      dispatch(GetActions.config({}));
      dispatch(GetActions.history({}));
    }
  }, [dispatch, roomId])

  useEffect(() => {
    if (roomId !== updates.watching) {
      if (updates.watching) {
        // Reduces updates.watching to be undefined
        dispatch(UpdatesAction.stopWatch());
      } else if (roomId) {
        // Runs on second pass if existing watch exists
        dispatch(UpdatesAction.startWatch());
      }
    }
  }, [dispatch, updates.watching, roomId])

  useEffect(() => {
    if (updates.config) {
      dispatch(UpdatesAction.config(false));
      dispatch(GetActions.config({}));
    }
  }, [dispatch, updates.config])

  useEffect(() => {
    if (updates.tx) {
      dispatch(UpdatesAction.tx(false));
      dispatch(GetActions.history({}));
    }
  }, [dispatch, updates.tx])

  return <div>
    <GameSetupView />
    {config.factor !== 0 && <>
      <ActionView />
      <GainsView />
      <HistoryView />
    </>}
  </div>
}