import React, { FunctionComponent } from "react";
import { getPlayers, getConfig, getHistory } from "../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { DeleteActions } from "../redux/actions";
import { historyToGains } from "../logic/logic";

export const GainsView: FunctionComponent = () => {
  const players = useSelector(getPlayers);
  const config = useSelector(getConfig);
  const history = useSelector(getHistory);
  const dispatch = useDispatch();

  const gains = historyToGains(history, config);

  return (<div>
    <h3>Gains</h3>
    <div>{players.dong} (dong) $ {gains.dong.toFixed(2)}</div>
    <div>{players.nan} (nan) $ {gains.nan.toFixed(2)}</div>
    <div>{players.xi} (xi) $ {gains.xi.toFixed(2)}</div>
    <div>{players.bei} (bei) $ {gains.bei.toFixed(2)}</div>
    <input type="button" onClick={() => dispatch(DeleteActions.allHistory({}))} value="Reset" />
  </div>);
}
