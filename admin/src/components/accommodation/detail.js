import React, { useState } from "react";
//
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DescriptionIcon from '@material-ui/icons/Description';
import EventIcon from '@material-ui/icons/Event';
//
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import api from "../../components/utils/api";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

const Detail = (props) => {
  //   const [handleOpen, setHandleOpen] = useState({ open: true, id: 0 });
  const classes = useStyles();
  const {
    history,
    activity,
    match: {
      params: { id },
    },
  } = props;
  //   const a = activity.find((p) => p.id === id);
  //   console.log("ni idea:",a)
  return (
    <div className={classes.root}>
      <Grid xs={6} sm={6} md={6}>
        <GridList cellHeight={200} spacing={1} className={classes.gridList}>
          {activity.map((i, index) => (
            <GridListTile
              key={i}
              cols={i.images[index].path ? 2 : 1}
              rows={i.images[index].path ? 2 : 1}
            >
              <img src={i.images[index].path} alt={i.name} />
              <GridListTileBar
                title={i.name}
                titlePosition="top"
                actionIcon={
                  <IconButton
                    aria-label={`star ${i.description}`}
                    className={classes.icon}
                  >
                    <StarBorderIcon />
                  </IconButton>
                }
                actionPosition="left"
                className={classes.titleBar}
              />
            </GridListTile>
          ))}
        </GridList>
      </Grid>
      <Grid xs={6} sm={6} md={6}>
        <Grid xs={3} sm={3} md={3}>
          <Typography variant="h1" component="h2">Nombre: {activity.name}</Typography>
        </Grid>
        <Grid xs={3} sm={3} md={3}>
          <Typography><DescriptionIcon/> {activity.description}</Typography>
        </Grid>
        <Grid xs={3} sm={3} md={3}>
          <Typography><AttachMoneyIcon/> {props.activity.price}</Typography>
        </Grid>
        <Grid xs={3} sm={3} md={3}>
          {" "}
          <Typography><EventIcon/> {activity.date}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};
const mapStateToProps = (state) => {
  debugger;
  return { activity: state.activity };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     deleteActivity: (activity) => dispatch(deleteActivity(activity)),
//   };
// };

export default connect(mapStateToProps)(withRouter(Detail));
