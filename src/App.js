import React from "react";
import { Dashboard, Login, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
      <AuthWrapper>
        <Router>
          <Switch>
            <Route path="/" exact={true}>
              <Dashboard/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="*">
              <Error/>
            </Route>
          </Switch>
        </Router>
      </AuthWrapper>
  );
}

export default App;