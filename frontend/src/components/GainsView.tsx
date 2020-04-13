import React, { FunctionComponent } from "react";
import { getGains, getPlayers } from "../redux/selectors";
import { useSelector } from "react-redux";

export const GainsView: FunctionComponent = () => {
  const gains = useSelector(getGains);
  const players = useSelector(getPlayers);

  return (<div>
    <h3>Gains</h3>
    <div>{players.dong}(dong) $ {gains.dong.toFixed(2)}</div>
    <div>{players.nan}(nan) $ {gains.nan.toFixed(2)}</div>
    <div>{players.xi}(xi) $ {gains.xi.toFixed(2)}</div>
    <div>{players.bei}(bei) $ {gains.bei.toFixed(2)}</div>
  </div>);
}
