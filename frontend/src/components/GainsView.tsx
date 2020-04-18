import React, { FunctionComponent } from "react";
import { getGains, getPlayers } from "../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { DeleteActions } from "../redux/actions";
import { useParams } from "react-router-dom";

export const GainsView: FunctionComponent = () => {
  const { roomId } = useParams();
  const gains = useSelector(getGains);
  const players = useSelector(getPlayers);
  const dispatch = useDispatch();

  return (<div>
    <h3>Gains</h3>
    <div>{players.dong}(dong) $ {gains.dong.toFixed(2)}</div>
    <div>{players.nan}(nan) $ {gains.nan.toFixed(2)}</div>
    <div>{players.xi}(xi) $ {gains.xi.toFixed(2)}</div>
    <div>{players.bei}(bei) $ {gains.bei.toFixed(2)}</div>
    <input type="button" onClick={() => dispatch(DeleteActions.allHistory({ urlParam: roomId }))} value="Reset" />
  </div>);
}
