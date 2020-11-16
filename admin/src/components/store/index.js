import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import person from "../reducer/person";
import activity from "../reducer/activity";
import accommodation from "../reducer/accommodation";

const reducers = combineReducers({ person, activity, form: formReducer,accommodation });

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
