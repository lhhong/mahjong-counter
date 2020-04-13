import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameSetupView } from "./components/GameSetupView";
import { GainsView } from "./components/GainsView";
import { ActionView } from "./components/ActionView";
import { useSelector } from "react-redux";
import { getConfig } from "./redux/selectors";

export const App = () => {
    const config = useSelector(getConfig);
    return (<div>
        <GameSetupView />
        {config.factor !== 0 && <>
        <ActionView />
        <GainsView />
        </>}
    </div>);
};
