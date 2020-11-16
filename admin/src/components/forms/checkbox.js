import React from "react";
import MuFormControlLabel from "@material-ui/core/FormControlLabel";
import { Grid } from "@material-ui/core";
import MuCheckbox from "@material-ui/core/Checkbox";

const Checkbox = ({ input, label, meta, ...custom }) => (
  <MuFormControlLabel
    control={
      <MuCheckbox
        checked={input.value ? true : false}
        onChange={input.onChange}
      />
    }
    label={label}
    {...custom}
  />
);
export default Checkbox;
