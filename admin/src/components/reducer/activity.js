import {SET_ACTIVITY,EDIT_ACTIVITY,DELETE_ACTIVITY,ADD_DATA} from '../constant/index';

const activity = (state = [], action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_ACTIVITY: 
    debugger
      return [...state,payload];
      case ADD_DATA:
        debugger
        return payload.activity;
      case DELETE_ACTIVITY:
        return state.filter(activity=> activity.id !== payload.id);
      case EDIT_ACTIVITY:
        return state.map(activity => {
          debugger
          if (payload.id === activity.id) {
            return payload;
          }
          return activity;
        });
    default:
      return state;
  }
};
export default activity;