import React, { useState,useEffect } from "react";
import { Field, reduxForm } from "redux-form";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Grid, Button, Box, makeStyles, Typography} from "@material-ui/core";
import TextField from "../forms/textField";
import TextFieldArea from "../forms/textFieldArea";
import FileInput from "../forms/fileInput";
import Maps from "../forms/maps";
import Checkbox from "../forms/checkbox";
import {
  editAccommodation,
  addAccommodation,
} from "../../components/actions/index";
import api from "../../components/utils/api";
// import Geocode from "react-geocode";
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



const FormAccommodation = (props) => {
  const classes = useStyles();
  // Geocode.setRegion("es");
  // Geocode.setApiKey("AIzaSyBmQdEHeqn5T-7PU8fNi-KhNx061DgX8KU");
  
  const {
    handleSubmit,
    reset,
    submitting,
    accommodation,
    match: {
      params: { id },
    },
  } = props;
  //  let a = accommodation.find((p) => p.id === parseInt(id));
  const submit = async (values) => {
    debugger;
    console.log("props", props);
    const image = [
      ...Array.from(values.image || []).map((it) => ({
        name: "image",
        file: it,
      })),
    ];
    // Geocode.fromAddress("Gutierrez, Maipu").then(
    //   response => { 
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
    const accommodation = {
      name: values.name,
      description: values.description,
      delegacy: values.delegacy,
      room: values.room,
      hed: values.hed,
      bath: values.bath,
      location: props.location.state.location,
      wifi: values.wifi ? 1 : 0,
      iron: values.iron ? 1 : 0,
      airConditioned: values.airConditioned ? 1 : 0,
      cable: values.cable ? 1 : 0,
      heating: values.heating ? 1 : 0,
      waterHot: values.waterHot ? 1 : 0,
      kitchen: values.kitchen ? 1 : 0,
      microwave: values.microwave ? 1 : 0,
      basicKitchenTools: values.basicKitchenTools ? 1 : 0,
      crockeryandcutlery: values.crockeryandcutlery ? 1 : 0,
      coffeMaker: values.coffeMaker ? 1 : 0,
      refrigerator: values.refrigerator ? 1 : 0,
      pool: values.pool ? 1 : 0,
      parking: values.parking ? 1 : 0,
      gym: values.gym ? 1 : 0,
      elevator: values.elevator ? 1 : 0,
      shampoo: values.shampoo ? 1 : 0,
      hairDryer: values.hairDryer ? 1 : 0,
      hangers: values.hangers ? 1 : 0,
    };
    if (id) {
      const result = await api.multipart(
        `/accommodation/${id}`,
        "put",
        accommodation,
        image
      );
      let a;
      for (let e in result.data.response) {
        a = result.data.response[e];
      }
      props.editAccommodation(a);
    } else {
      const result = await api.multipart(
        "/accommodation",
        "post",
        accommodation,
        image
      );
      let a;
      for (let e in result.data.response) {
        a = result.data.response[e];
      }
      props.addAccommodation(a);
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
          Datos del Alojamiento
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Field
              name="name"
              component={TextField}
              label="Nombre del Alojamiento"
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
            <Field
              name="delegacy"
              component={TextField}
              label="Cantidad de Huespedes"
              className={classes.field}
              fullWidth
              type="number"
            />
            <Field
              name="room"
              component={TextField}
              label="Cantidad de Habitaciones"
              className={classes.field}
              fullWidth
              type="number"
            />
            <Field
              name="hed"
              component={TextField}
              label="Cantidad de Camas"
              className={classes.field}
              fullWidth
              type="number"
            />
            <Field
              name="bath"
              component={TextField}
              label="Cantidad de Baños"
              className={classes.field}
              fullWidth
              type="number"
            />
            <Field
              name="location"
              component={Maps}
              label="Ubicacion"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Servicios
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="wifi"
              component={Checkbox}
              label="Wifi"
              className={classes.field}
              fullWidth
            />
            <Field
              name="iron"
              component={Checkbox}
              label="Plancha"
              className={classes.field}
              fullWidth
            />
            <Field
              name="airAconditioned"
              component={Checkbox}
              label="Aire Acondicionado"
              className={classes.field}
              fullWidth
            />
            <Field
              name="cable"
              component={Checkbox}
              label="Cable"
              className={classes.field}
              fullWidth
            />
            <Field
              name="heating"
              component={Checkbox}
              label="Calefaccion"
              className={classes.field}
              fullWidth
            />
            <Field
              name="waterHot"
              component={Checkbox}
              label="Agua Caliente"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Comedor
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="kitchen"
              component={Checkbox}
              label="Cocina"
              className={classes.field}
              fullWidth
            />
            <Field
              name="microwave"
              component={Checkbox}
              label="Microondas"
              className={classes.field}
              fullWidth
            />
            <Field
              name="basicKitchenTools"
              component={Checkbox}
              label="Utensilios Basicos de Cocina"
              className={classes.field}
              fullWidth
            />
            <Field
              name="crockeryandcutlery"
              component={Checkbox}
              label="Bajilla y Cubiertos"
              className={classes.field}
              fullWidth
            />
            <Field
              name="coffeMaker"
              component={Checkbox}
              label="Cafetera"
              className={classes.field}
              fullWidth
            />
            <Field
              name="refrigerator"
              component={Checkbox}
              label="Heladera"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Instalaciones
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="pool"
              component={Checkbox}
              label="Pileta"
              className={classes.field}
              fullWidth
            />
            <Field
              name="parking"
              component={Checkbox}
              label="Estacionamiento"
              className={classes.field}
              fullWidth
            />
            <Field
              name="gym"
              component={Checkbox}
              label="Gimnasio"
              className={classes.field}
              fullWidth
            />
            <Field
              name="elevator"
              component={Checkbox}
              label="Ascensor"
              className={classes.field}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Dormitorio y Baño
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              name="shampoo"
              component={Checkbox}
              label="Shampoo"
              className={classes.field}
              fullWidth
            />
            <Field
              name="hairDryer"
              component={Checkbox}
              label="Secador de Pelo"
              className={classes.field}
              fullWidth
            />
            <Field
              name="hangers"
              component={Checkbox}
              label="Perchas"
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
  const {
    match: {
      params: { id },
    },
  } = ownProps;
  let acc = state.accommodation;
  let value = acc.find((p) => p.id === parseInt(id));
  const initialValues = value
    ? {
        name: value.name,
        description: value.description,
        delegacy: value.delegacy,
        room: value.room,
        hed: value.hed,
        bath: value.bath,
        latitude: value.latitude,
        longitude: value.longitude,
        wifi: value.wifi,
        iron: value.iron,
        airConditioned: value.airConditioned,
        cable: value.cable,
        heating: value.heating,
        waterHot: value.waterHot,
        kitchen: value.kitchen,
        microwave: value.microwave,
        basicKitchenTools: value.basicKitchenTools,
        crockeryandcutlery: value.crockeryandcutlery,
        coffeMaker: value.coffeMaker,
        refrigerator: value.refrigerator,
        pool: value.pool,
        parking: value.parking,
        gym: value.gym,
        elevator: value.elevator,
        shampoo: value.shampoo,
        hairDryer: value.hairDryer,
        hangers: value.hangers,
      }
    : false;
  return { accommodation: state.accommodation, initialValues };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAccommodation: (accommodation) =>
      dispatch(addAccommodation(accommodation)),
    editAccommodation: (accommodation) =>
      dispatch(editAccommodation(accommodation)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(
  reduxForm({
    form: "FormAccommodation", // a unique identifier for this form
    validate,
    //asyncValidate
  })(FormAccommodation)
);
