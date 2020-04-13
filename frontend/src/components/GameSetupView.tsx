import * as React from "react";
import { GameSetupActions } from "../redux/actions";
import { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

interface DispatchProps {
  setGameSetup: typeof GameSetupActions.set;
}
type Props = DispatchProps;

const GameSetupViewInternal: FunctionComponent<Props> = (props) => {
  const [dong, setDong] = useState<string>("player 1");
  const [nan, setNan] = useState<string>("player 2");
  const [xi, setXi] = useState<string>("player 3");
  const [bei, setBei] = useState<string>("player 4");

  const [factor, setFactor] = useState<number>(0.2);
  const [minTai, setMinTai] = useState<number>(1);
  const [maxTai, setMaxTai] = useState<number>(5);
  const [shooter, setShooter] = useState<boolean>(true);
  const [sanLiu, setSanLiu] = useState<boolean>(false);
  return (<div>
    <h3>Config</h3>
    <label>dong</label>
    <input value={dong} onFocus={e => e.target.select()} onChange={e => setDong(e.target.value)} />
    <label>nan</label>
    <input value={nan} onFocus={e => e.target.select()} onChange={e => setNan(e.target.value)} />
    <label>xi</label>
    <input value={xi} onFocus={e => e.target.select()} onChange={e => setXi(e.target.value)} />
    <label>bei</label>
    <input value={bei} onFocus={e => e.target.select()} onChange={e => setBei(e.target.value)} />
    <label>factor</label>
    <input type="number" value={factor} onFocus={e => e.target.select()} onChange={e => setFactor(e.target.valueAsNumber)} />
    <label>min tai</label>
    <input type="number" value={minTai} onFocus={e => e.target.select()} onChange={e => setMinTai(e.target.valueAsNumber)} />
    <label>max tai</label>
    <input type="number" value={maxTai} onFocus={e => e.target.select()} onChange={e => setMaxTai(e.target.valueAsNumber)} />
    <label>shooter</label>
    <input type="checkbox" checked={shooter} onChange={e => setShooter(e.target.checked)} />
    <label>san liu</label>
    <input type="checkbox" checked={sanLiu} onChange={e => setSanLiu(e.target.checked)} />
    <input type="button" value="Confirm" onClick={() => props.setGameSetup({
      players: { dong, nan, xi, bei },
      config: { factor, minTai, maxTai, shooter, sanLiu },
    })} />
  </div>);
}

export const GameSetupView = connect(() => ({}), {setGameSetup: GameSetupActions.set})(GameSetupViewInternal);