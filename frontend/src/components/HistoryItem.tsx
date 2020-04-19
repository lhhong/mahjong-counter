import React, { FunctionComponent } from "react";
import { MJEvent } from "../interfaces/mjEvents";
import { eventToGains } from "../logic/logic";
import { useSelector, useDispatch } from "react-redux";
import { getConfig, getPlayers } from "../redux/selectors";
import { DeleteActions } from "../redux/actions";

interface Props {
  event: MJEvent;
}

export const HistoryItem: FunctionComponent<Props> = ({ event }) => {
  const dispatch = useDispatch();
  const players = useSelector(getPlayers);
  const config = useSelector(getConfig);
  const payout = eventToGains(event, config);
  return <div>
    <strong>Transaction</strong>
    <input type="button" value="Delete entry" onClick={() => {
      dispatch(DeleteActions.event({ urlParam: event.id }))
    }} />
    <div>Event: {event.event}</div>
    {event.event !== "manual" && <div>Target: {players[event.target]} ({event.target})</div>}
    {event.event !== "manual" && event.feeder && <div>Feeder: {players[event.feeder]} ({event.target})</div>}
    {event.event === "ga" && <>
      <div>an ga: {event.anGa.toString()}</div>
      <div>complete set: {event.completeSet.toString()}</div>
    </>}
    {event.event === "gang" && <>
      <div>an gang: {event.anGang.toString()}</div>
    </>}
    {event.event === "hu" && <>
      {event.huType && <div>hu type: {event.huType}</div>}
      <div>tai: {event.tai}</div>
      <div>zi mo: {event.ziMo.toString()}</div>
      {event.yiPaoSanXiang && <div>Yi Pao San Xiang</div>}
      {event.zhaHu && <div>Zha Hu</div>}
    </>}
    <div>Payout:</div>
    <div>{players.dong} (dong): {payout.dong}</div>
    <div>{players.nan} (nan): {payout.nan}</div>
    <div>{players.xi} (xi): {payout.xi}</div>
    <div>{players.bei} (bei): {payout.bei}</div>
  </div>
}