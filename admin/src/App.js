import "./App.css";
import React,{useEffect} from "react";
import { Provider } from "react-redux";
import Menu from "./components/menu/menu";
import Activities from "./components/activity/table";
import FormActivities from "./components/activity/form";
import Detail from "./components/forms/carousel";
import Reserves from "./components/reserve/tableList";
import  Login from "./components/login/login";
import FormAccommodation from "./components/accommodation/form";
import TableAccommodation from "./components/accommodation/table";
import Maps from "./components/forms/maps";
import store from "./components/store/index";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import api from "./components/utils/api";
import { connect } from "react-redux";
import { addData } from "./components/actions/index";

import routes from "./components/routes";
// import SearchAppBar from "./components/forms/SearchAppBar";

const App = connect(
  null,
  mapDispatchToProps
)(props => {
  useEffect(() => {
    api.get("/data").then(result => {
      props.addData(result.data.response);
    });
  });
  return (
    <BrowserRouter>
    <Menu/>
      <Switch>
        <Route exact path={routes.tableActivities} component={Activities} />
        <Route exact path={routes.formActivities} component={FormActivities} />
        <Route exact path={routes.editActivities} component={FormActivities} />
        <Route exact path={routes.detail} component={Detail} />
        <Route exact path={routes.reserves} component={Reserves} />
        <Route exact path={routes.formAccommodation} component={FormAccommodation} />
        <Route exact path={routes.editAccommodation} component={FormAccommodation} />
        <Route exact path={routes.tableAccommodation} component={TableAccommodation} />
        <Route exact path={routes.maps} component={Maps} />
        <Route exact path={routes.login} component={Login} />
        {/* <Redirect exact path={routes.menu} component={Menu}/> */}
      </Switch>
    </BrowserRouter>
  );
});
function mapDispatchToProps(dispatch) {
  return {
    addData: data => dispatch(addData(data))
  };
}
const ConnectedApp = props => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default ConnectedApp;
