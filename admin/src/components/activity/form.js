import React, { useState } from "react";
import { Field, reduxForm } from "redux-form";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Grid, Button, Box, makeStyles, Typography } from "@material-ui/core";
import TextField from "../forms/textField";
import TextFieldArea from "../forms/textFieldArea";
import FileInput from "../forms/fileInput";
import DatePicker from "../forms/datePicker";
import { editActivity, setActivity } from "../../components/actions/index";
import api from "../../components/utils/api";
// import routes from "../routes";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  field: {
    marginBottom: 20,
  },
}));

const validate = (values) => {
  const errors = {};
  const requiredFields = ["name", "description"];
  if (!values.id) {
    Array.prototype.push.apply(requiredFields, [, "images"]);
  }

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

const FormActivity = (props) => {
  const classes = useStyles();
  const {
    handleSubmit,
    reset,
    submitting,
    act,
    match: {
      params: { id },
    },
  } = props;
  let a = act.find((p) => p.id === parseInt(id));

  const submit = async (values) => {
    debugger;
    const image = [
      ...Array.from(values.image || []).map((it) => ({
        name: "image",
        file: it,
      })),
    ];
    const activity = {
      name: values.name,
      description: values.description,
      // image: values.path,
      price: values.price,
      date: values.date,
    };
    if (id) {
      const result = await api.multipart(
        `/activity/${id}`,
        "put",
        activity,
        image
      );
      let a;
      for (let e in result.data.response) {
        a = result.data.response[e];
      }
      props.editActivity(a);
    } else {
      const result = await api.multipart("/activity", "post", activity, image);
      let a;
      for (let e in result.data.response) {
        a = result.data.response[e];
      }
      props.setActivity(a);
      console.log("set activity: ", a);
    }
    props.history.push("/");
  };
  // const LinkAddEvent = React.forwardRef((props, ref) => (
  //   // <RouterLink innerRef={ref} to={routes.home} {...props} />
  // ));

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Datos de la Actividad
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="name"
              component={TextField}
              label="Nombre de la Actividad"
              className={classes.field}
              fullWidth
            />
            <Field
              name="description"
              component={TextFieldArea}
              label="Descripción"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="image"
              component={FileInput}
              label="Galeria de fotos"
              multiple
              // preview={a ? a.path : []}
              className={classes.field}
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="price"
              component={TextField}
              label="Precio"
              type="number"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="date"
              component={DatePicker}
              label="Fecha"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Grid>
        <Button
          color="primary"
          type="submit"
          disabled={submitting}
          variant="contained"
          style={{ marginRight: 10 }}
        >
          Guardar
        </Button>

        <Button
          // component={LinkAddEvent}
          color="primary"
          type="button"
          onClick={reset}
        >
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};
const mapStateToProps = (state, ownProps) => {
  debugger;
  const {
    match: {
      params: { id },
    },
  } = ownProps;
  let act = state.activity;
  let aa = act.find((p) => p.id === parseInt(id));
  const initialValues = aa
    ? {
        id: aa.id,
        name: aa.name,
        description: aa.description,
        image: aa.path,
        price: aa.price,
        date: moment(aa.date).format("YYYY-MM-DD"),
      }
    : false;
  return { initialValues, act };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActivity: (activity) => dispatch(setActivity(activity)),
    editActivity: (activity) => dispatch(editActivity(activity)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(
  reduxForm({
    form: "FormActivity", // a unique identifier for this form
    validate,
    //asyncValidate
  })(FormActivity)
);
