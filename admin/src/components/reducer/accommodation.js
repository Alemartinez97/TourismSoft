import {ADD_ACCOMMODATION,EDIT_ACCOMMODATION,DELETE_ACCOMMODATION,ADD_DATA} from '../constant/index';

const accommodation = (state = [], action) => {
  const {type, payload} = action;
  switch (type) {
    case ADD_ACCOMMODATION:
      return [...state, payload];
      case ADD_DATA:
        console.log("payload.accommodation: ",payload.accommodation)
        return payload.accommodation;
      case DELETE_ACCOMMODATION:
        return state.filter(accommodation => accommodation.id !== payload.id);
      case EDIT_ACCOMMODATION:
        return state.map(accommodation => {
          if (payload.id === accommodation.id) {
            return payload;
          }
          return accommodation;
        });
    default:
      return state;
  }
};
export default accommodation;
