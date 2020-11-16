import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { withRouter } from "react-router-dom";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }), 
    marginLeft: 0,
  },
}));

const Menu = ({ history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Administrador
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
          <ListItem button>
            <ListItemIcon>{<MailIcon />}Inicio</ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem button>
            <ListItemIcon onClick={() => history.push("/tableAccommodation")}>
              {<MailIcon />}Alojamiento
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem button>
            <ListItemIcon onClick={() => history.push("/activities")}>
              {<MailIcon />}Actividades
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem button>
            <ListItemIcon onClick={() => history.push("/reserves")}>
              {<MailIcon />}Reservas
            </ListItemIcon>
            <ListItemText />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
};
export default withRouter(Menu);

// import React, { useState } from "react";
// import {Navbar,Nav,NavDropdown,Form,FormControl,Button} from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { withNamespaces } from "react-i18next";
// import { withRouter } from "react-router-dom";
// import "../../App.css";

// const SearchAppBar = props => {
//   const { t, history } = props;

//   return (
//     <div className="text">
//     <Navbar class="navbar navbar-expand-lg navbar-light bg-light"  variant="dark">
//       <Nav className="mr-auto">
//       <Nav.Link onClick={()=> history.push("/aboutUs")} class="text-white">Quienes Somos</Nav.Link>
//         <NavDropdown title="Servicios" id="collasible-nav-dropdown">
//         <NavDropdown.Item  onClick={()=> history.push("/webDevelopment")} className="text">Desarrollo Web</NavDropdown.Item>
//         <NavDropdown.Item href="#action/3.3"></NavDropdown.Item>
//       </NavDropdown>
//         <Nav.Link onClick={()=> history.push("/whyWe")}  className="text">Por que Nosotros</Nav.Link>
//         <Nav.Link onClick={()=> history.push("/formContactUs")} className="text">Contactenos</Nav.Link>
//       </Nav>
//       <Form inline>
//         <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//         <Button variant="outline-light" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">Search</Button>
//       </Form>
//     </Navbar>
//   </div>
//   );
// };

// export default withNamespaces()(withRouter(SearchAppBar));
