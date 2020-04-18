import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";

export const Lobby: FunctionComponent = () => {

  const [roomId, setRoomId] = useState<string>();

  return <>
    <h3>Room ID</h3>
    <input onChange={(e) => setRoomId(e.target.value)} />
    <Link to={`/${roomId}`}>GO</Link>
  </>
}