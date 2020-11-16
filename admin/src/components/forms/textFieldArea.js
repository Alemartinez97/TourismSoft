import React from "react";
import MuTextFieldArea from "@material-ui/core/TextField";

const TextFieldArea = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <MuTextFieldArea
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    multiline
    rowsMax="8"
    {...input}
    {...custom}
  />
);
export default TextFieldArea;
