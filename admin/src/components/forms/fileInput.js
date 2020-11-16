import React from "react";
import ImagePreview from "./imagePreview";
import TextField from "./textField";
import { FormControl,  Box, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  images: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    textIndent: "calc(100%)",
    paddingLeft: "calc(100% - 200px)",
  },
}));

const FileInput = (props) => {
  const classes = useStyles();
  const { preview, label, multiple } = props;
  return (
    <FormControl fullWidth>
      <TextField
        inputProps={{
          className: classes.input,
          multiple,
        }}
        type="file"
        value={null}
        {...props}
      />
      <Box className={classes.images}>
        {preview &&
          preview.map((url, key) => <ImagePreview key={url} src={url} />)}
      </Box>
    </FormControl>
  );
};

export default FileInput;
