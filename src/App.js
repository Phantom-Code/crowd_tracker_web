import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/loginComp";
import Register from "./components/registerComp";
import MapComp from "./components/mapComp";
import Home from "./components/homeComp";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <div>
      <div>NavBar Here</div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={MapComp} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
