import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { getHistory } from "../redux/selectors";
import { HistoryItem } from "./HistoryItem";

export const HistoryView: FunctionComponent = () => {
  const history = useSelector(getHistory);

  return <div>
    <h3>Transaction History</h3>
    {history.map((event, index) => <HistoryItem key={index} event={event} />)}
  </div>
}