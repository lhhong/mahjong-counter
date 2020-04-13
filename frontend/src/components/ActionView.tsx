import * as React from "react";
import { LogicActions } from "../redux/actions";
import { FunctionComponent, useState } from "react";
import { connect, useSelector } from "react-redux";
import Select, { ValueType, OptionsType } from "react-select";
import { Seat } from "../interfaces/players";
import { getPlayers } from "../redux/selectors";
import { useEffect } from "react";

interface DispatchProps {
  newEvent: typeof LogicActions.newEvent;
}
type Props = DispatchProps;

interface PlayerOption {
  value?: string;
  label: string;
}

const ActionViewInternal: FunctionComponent<Props> = (props) => {
  const players = useSelector(getPlayers);

  const [playerOptions, setPlayerOptions] = useState<OptionsType<PlayerOption>>([
    { value: "dong", label: players.dong || "dong" },
    { value: "nan", label: players.nan || "nan" },
    { value: "xi", label: players.xi || "xi" },
    { value: "bei", label: players.bei || "bei" },
  ]);

  useEffect(() => setPlayerOptions([
    { value: "dong", label: players.dong || "dong" },
    { value: "nan", label: players.nan || "nan" },
    { value: "xi", label: players.xi || "xi" },
    { value: "bei", label: players.bei || "bei" },
  ]), [players]);

  const [event, setEvent] = useState<string>("hu");

  const [target, setTarget] = useState<ValueType<PlayerOption>>();
  const [feeder, setFeeder] = useState<ValueType<PlayerOption>>();

  const [anGa, setAnGa] = useState<boolean>(false);
  const [completeSet, setCompleteSet] = useState<boolean>(false);
  const [anGang, setAnGang] = useState<boolean>(false);

  const [huType, setHuType] = useState<string>();
  const [tai, setTai] = useState<number>(1);
  const [ziMo, setZiMo] = useState<boolean>(false);
  const [zhaHu, setZhaHu] = useState<boolean>(false);
  const [yiPaoSanXiang, setYiPaoSanXiang] = useState<boolean>(false);

  return (<div>
    <h3>Create Transaction</h3>
    <div>
      <input id="hu" type="radio" name="event" value="hu" defaultChecked onChange={e => setEvent(e.target.value)} />
      <label htmlFor="hu">hu</label>
      <input id="ga" type="radio" name="event" value="ga" onChange={e => setEvent(e.target.value)} />
      <label htmlFor="ga">ga</label>
      <input id="gang" type="radio" name="event" value="gang" onChange={e => setEvent(e.target.value)} />
      <label htmlFor="gang">gang</label>
    </div>
    <label>target</label>
    <Select
      value={target}
      onChange={(selected) => setTarget(selected)}
      options={playerOptions}
    />
    <label>feeder</label>
    <Select
      value={feeder}
      onChange={(selected) => setFeeder(selected)}
      options={[{ value: undefined, label:"None" }, ...playerOptions]}
    />
    {event === "ga" && <>
    <label>an ga</label>
    <input type="checkbox" checked={anGa} onChange={e => setAnGa(e.target.checked)} />
    <label>complete set</label>
    <input type="checkbox" checked={completeSet} onChange={e => setCompleteSet(e.target.checked)} />
    </>}
    {event === "gang" && <>
    <label>an gang</label>
    <input type="checkbox" checked={anGang} onChange={e => setAnGang(e.target.checked)} />
    </>}
    {event === "hu" && <>
    <label>hu type</label>
    <input value={huType} onFocus={e => e.target.select()} onChange={e => setHuType(e.target.value)} />
    <label>tai</label>
    <input type="number" value={tai} onFocus={e => e.target.select()} onChange={e => setTai(e.target.valueAsNumber)} />
    <label>zi mo</label>
    <input type="checkbox" checked={ziMo} onChange={e => setZiMo(e.target.checked)} />
    <label>yi pao san xiang</label>
    <input type="checkbox" checked={yiPaoSanXiang} onChange={e => setYiPaoSanXiang(e.target.checked)} />
    <label>zha hu</label>
    <input type="checkbox" checked={zhaHu} onChange={e => setZhaHu(e.target.checked)} />
    </>}
    <input type="button" value="Confirm" onClick={() => {
      const common = {
        target: (target as PlayerOption)?.value as Seat,
        feeder: (feeder as PlayerOption)?.value as Seat,
      };
      switch (event) {
        case "hu":
          props.newEvent({ ...common, event, huType, ziMo, tai, yiPaoSanXiang, zhaHu });
          break;
        case "ga":
          props.newEvent({ ...common, event, anGa, completeSet });
          break;
        case "gang":
          props.newEvent({ ...common, event, anGang });
          break;
      }
    }} />
  </div>);
}

export const ActionView = connect(() => ({}), {newEvent: LogicActions.newEvent})(ActionViewInternal);
