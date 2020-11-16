import React, { useState, useLayoutEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
// // import { editPerson, deletePerson, setPerson } from "../../Redux/Actions/Index";
import { withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import { deleteActivity } from "../../components/actions/index";
import api from "../../components/utils/api";

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

const Form = (props) => {
  const [handleOpen, setHandleOpen] = useState({ open: false, id: 0 });
  const classes = useStyles();
  const { history, activity, isMobile } = props;
  // let image=[0];
  // useLayoutEffect(() => {
  //   image = activity.filter((e) => handleOpen.id === e.id);
  // });
  const handleDelete = (newData) => {
    const e = activity.filter((t) => t.id === newData.id);
    debugger;
    api._delete(`/activity/${newData.id}`, newData).then((result) => {
      debugger;
      const activity = {
        id: result.data.response,
        ...newData,
      };
      props.deleteActivity(activity);
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
          onClick={() => history.push("/formactivity")}
          className={classes.margin}
        >
          <AddIcon />
        </Fab>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {activity.map((e, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <img
                  Key={index}
                  src={e.images[0].path}
                  alt={e.name}
                  width={270}
                  height={270}
                />
                {/* <Carousel autoPlay showStatus={handleOpen.open}>
                  {e.images.map(({ id, path }) => (
                    <div>
                      <img alt="" src={path} />
                      <p className="legend">Legend 1</p>
                    </div>
                  ))}
                </Carousel> */}
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {e.name}
                  </Typography>
                  <Typography>{e.description}</Typography>
                  <Typography>
                    Fecha: {moment(e.date).format("YYYY-MM-DD")}
                  </Typography>
                  <Typography>Precio: ${e.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => props.history.push(`/detail/${e.id}`)}
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
                      props.history.push(`/edit-activities/${e.id}`)
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
              {/* <Carousel autoPlay showStatus={handleOpen.open}>
                {e.images.map(({ id, path }) => (
                  <div>
                    <img alt="" src={path} />
                    <p className="legend">Legend 1</p>
                  </div>
                ))}
              </Carousel> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return { activity: state.activity };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form));
