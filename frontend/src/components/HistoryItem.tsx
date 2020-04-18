import React, { FunctionComponent } from "react";
import { MJEvent } from "../interfaces/mjEvents";
import { eventToGains } from "../logic/logic";
import { useSelector, useDispatch } from "react-redux";
import { getConfig } from "../redux/selectors";
import { useParams } from "react-router-dom";
import { DeleteActions } from "../redux/actions";

interface Props {
  event: MJEvent;
}

export const HistoryItem: FunctionComponent<Props> = ({ event }) => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const config = useSelector(getConfig);
  const payout = eventToGains(event, config);
  return <div>
    <strong>Transaction</strong>
    <input type="button" value="Delete entry" onClick={() => {
      dispatch(DeleteActions.event({ urlParam: { rid: roomId, tid: event.id }}))
    }} />
    <div>Event: {event.event}</div>
    <div>Target: {event.target}</div>
    {event.feeder && <div>Feeder: {event.feeder}</div>}
    {event.event === "ga" && <>
      <div>an ga: {event.anGa}</div>
      <div>complete set: {event.completeSet}</div>
    </>}
    {event.event === "gang" && <>
      <div>an gang: {event.anGang}</div>
    </>}
    {event.event === "hu" && <>
      {event.huType && <div>hu type: {event.huType}</div>}
      <div>tai: {event.tai}</div>
      <div>zi mo: {event.ziMo.toString()}</div>
      {event.yiPaoSanXiang && <div>Yi Pao San Xiang</div>}
      {event.zhaHu && <div>Zha Hu</div>}
    </>}
    <div>Payout:</div>
    <div>dong: {payout.dong}</div>
    <div>nan: {payout.nan}</div>
    <div>xi: {payout.xi}</div>
    <div>bei: {payout.bei}</div>
  </div>
}