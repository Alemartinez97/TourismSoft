import React from "react";
import MuTextField from "@material-ui/core/TextField";

const TextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <MuTextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
    type="date"
    InputLabelProps={{
      shrink: true,
    }}
  />
);

export default TextField;
