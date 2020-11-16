import {
  SET_FORM,
  EDIT_PERSON,
  DELETE_PERSON,
  ADD_PERSON,
  ADD_DATA,
  SET_ACTIVITY,
  EDIT_ACTIVITY,
  DELETE_ACTIVITY,
  ADD_ACCOMMODATION,
  DELETE_ACCOMMODATION,
  EDIT_ACCOMMODATION
} from "../constant/index";

export const setPerson = (payload) => {
  return { type: SET_FORM, payload };
};
export const deletePerson = (payload) => {
  return { type: DELETE_PERSON, payload };
};
export const editPerson = (payload) => {
  return { type: EDIT_PERSON, payload };
};
export const addPerson = (payload) => {
  return { type: ADD_PERSON, payload };
};
export const addData = (payload) => {
  return { type: ADD_DATA, payload };
};
export const setActivity = (payload) => {
  return { type: SET_ACTIVITY, payload };
};
export const deleteActivity = (payload) => {
  return { type: DELETE_ACTIVITY, payload };
};
export const editActivity = (payload) => {
  return { type: EDIT_ACTIVITY, payload };
};
export const addAccommodation = (payload) => {
  return { type: ADD_ACCOMMODATION, payload };
};
export const deleteAccommodation = (payload) => {
  return { type: DELETE_ACCOMMODATION, payload };
};
export const editAccommodation = (payload) => {
  return { type: EDIT_ACCOMMODATION, payload };
};
