import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { GamePage } from "./components/GamePage";
import { Lobby } from "./components/Lobby";

export const App = () => {
    return <Router>
        <Switch>
            <Route path="/:roomId">
                <GamePage />
            </Route>
            <Route path="/">
                <Lobby />
            </Route>
        </Switch>
    </Router>;
};
