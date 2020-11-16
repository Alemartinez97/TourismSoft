import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { withRouter } from "react-router";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import api from "../utils/api";
// import { serverBaseUrl } from '../config';
// import { compose } from 'recompose';
// import { connect } from 'react-redux';
 //import { clearUserToken } from '../actions/app';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  rightButton: {
    float: "right",
  },
  textField: {
    width: "100%",
  },
}));

const Login = (props) => {
  const { success, error, loading } = props;
  const serverBaseUrl = "http://localhost:3003";
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const responseGoogle = (response) => {
    debugger;
     api.post(`${serverBaseUrl}/api/auth`, response).then((result) => {});
    console.log("q onda", response);
  };
  const logout = () => {
    console.log('logout') // eslint-disable-line
  }
  // useEffect(() => {
  //   clearUserToken();
  // }, [clearUserToken]);

  return (
    <Container maxWidth="xs">
      <Paper className={classes.root} justify-content="center">
        <form
          method="POST"
          action={`${serverBaseUrl}/api/auth/register`}
          noValidate
          autoComplete="off"
        >
          <Grid>
          <GoogleLogin
            clientId="706833294096-9tk8lu767427n3q3oohjfsdckcfafb22.apps.googleusercontent.com"
            buttonText="Iniciar Sesion"
            cookiePolicy={"single_host_origin"}
            onSuccess={responseGoogle}
             onFailure={responseGoogle}
             onChange={responseGoogle}
            // onRequest={loading}
            // offline={false}
            // approvalPrompt="force"
             //responseType="id_token"
            // isSignedIn
             theme="dark"
          />
          {/* <GoogleLogout
              clientId="706833294096-9tk8lu767427n3q3oohjfsdckcfafb22.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={logout}
            ></GoogleLogout> */}
          <Grid item xs={12}>
              <TextField
                autoFocus
                label="Email"
                type="email"
                name="email"
                margin="normal"
                value={email}
                className={classes.textField}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                name="pass"
                type="password"
                margin="normal"
                value={pass}
                className={classes.textField}
                onChange={(e) => setPass(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary"
            //    onClick={() => history.push('/')}
               >
                Iniciar sesiôn
              </Button>
              {/* <Button
                className={classes.rightButton}
                // onClick={() => history.push('/Register')}
              >
                o crea una cuenta
              </Button> */}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// const mapDispatchToProps = {
//   clearUserToken,
// };

// export default compose(
//   withRouter,
//   connect(null, mapDispatchToProps),
// )(Signin);
export default withRouter(Login);
