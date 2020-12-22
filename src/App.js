import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/loginComp";
import Register from "./components/registerComp";
import MapComp from "./components/mapComp";
import NavComp from "./components/navComp";
import Home from "./components/homeComp";
import Charts from "./components/chartsComp";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <NavComp />
          <Switch>
            <PrivateRoute exact path="/" component={MapComp} />
            <PrivateRoute exact path="/charts" component={Charts} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
