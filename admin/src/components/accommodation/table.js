import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
// import { AutoRotatingCarousel } from "material-auto-rotating-carousel";
// import Slide from "../../components/forms/slide";
import moment from "moment";
import { deleteAccommodation } from "../../components/actions/index";
import api from "../../components/utils/api";
import accommodation from "../reducer/accommodation";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Table = (props) => {
  const [handleOpen, setHandleOpen] = useState({ open: false, id: 0 });
  const classes = useStyles();
  const { history, accommodation, isMobile } = props;

  const handleDelete = (newData) => {
    api._delete(`/activity/${newData.id}`, newData).then((result) => {
      debugger;
      const accommodation = {
        id: result.data.response,
        ...newData,
      };
      props.deleteAccommodation(accommodation);
    });
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <div>
        <Fab
          size="small"
          color="secondary"
          aria-label="add"
          onClick={() => history.push("/accommodation")}
          className={classes.margin}
        >
          <AddIcon />
        </Fab>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {accommodation.map((e, index) => (
            <Grid item key={e} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <img
                  src={e.images[0].path}
                  alt={e.name}
                  width={270}
                  height={270}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {e.name}
                  </Typography>
                  <Typography>{e.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={
                      () => setHandleOpen({ open: true, id: e.id })
                      // props.history.push(`/detail/${e.id}`)
                    }
                  >
                    Ver
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      // props.history.push({
                      //   pathname: `/edit-activity/${e.id}`,
                      //   state: { activit: e }
                      // })
                      props.history.push(`/accommodation/${e.id}`)
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleDelete(e)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
              {/* <div>
                <AutoRotatingCarousel
                  // label="Get started"
                  open={handleOpen.open}
                  onClose={() => setHandleOpen({ open: false })}
                  onStart={() => setHandleOpen({ open: false })}
                  autoplay={false}
                  mobile={isMobile}
                  style={{ position: "absolute" }}
                >
                  {e.images
                    // .filter((t) => t.id === handleOpen.id)
                    .map((i) => (
                      <Slide
                        key={i}
                        media={<img src={i.path} width="100%" height="100%" />}
                        // mediaBackgroundStyle={{
                        //   backgroundColor: blueGreyt[400],
                        // }}
                        // style={{ backgroundColor: blueGrey[600] }}
                      />
                    ))}
                </AutoRotatingCarousel>
              </div> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  console.log("state.accommodation: ", state.accommodation);
  debugger;
  return { accommodation: state.accommodation };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAccommodation: (accommodation) =>
      dispatch(deleteAccommodation(accommodation)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Table));
