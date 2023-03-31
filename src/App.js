import React from "react";
import "./App.css";
import "./assets/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "./assets/scss/custom.scss";
import "./assets/scss/custom-variables.scss";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.min";
import { Router } from "react-router-dom";
import { routes } from "./Controller/Routes";
import { history } from "./Controller/history";
import { PublicRoute } from "./Controller/PublicPath";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import LogOut from "./Components/Logout";
import PrivateRoute from "./Controller/PrivatePath";

import "./assets/css/responsive.css";


function App() {
  return (
    <div id="app_main" className={`App text-left`}>
      <Router history={history} getUserConfirmation={null}>
        <PublicRoute restricted exact path={routes.login} component={Login} />
        <PublicRoute exact path={routes.logout} component={LogOut} />
        <PrivateRoute exact path={routes.dashboard.self} component={Dashboard} />
      </Router>
    </div>
  );
}

export default App;
