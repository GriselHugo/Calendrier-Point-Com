import React, { useState } from "react";
import expressServer from "../../api/server-express";

import Alert from 'react-bootstrap/Alert';

import "./Login.css";

import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { lockClosed } from 'ionicons/icons';
import { eye } from 'ionicons/icons';
import { eyeOff } from 'ionicons/icons';

function signUpButtons({ setAction, setIsLogged, setShowAlert, setAlertMessage, username, password }) {
  const signUp = async (username, password) => {
    if (username === "" || password === "") {
      setShowAlert(true);
      setAlertMessage("Please fill all the fields !");
      return;
    }

    expressServer.signUp(username, password).then((response) => {
      if (response.status === 201) {
        setIsLogged(true);
        // console.log(response.data[0].id);
        localStorage.setItem("currentUserId", response.data[0].id);
        localStorage.setItem("isLogged", 1);
        setShowAlert(false);
        setAlertMessage("");
      } else if (response.status === 200) {
        setIsLogged(false);
        localStorage.setItem("isLogged", 0);
        setShowAlert(true);
        setAlertMessage("A user with this name already exists !");
      }
    }).catch((error) => {
      console.log("Error : " + error);
      setIsLogged(false);
      localStorage.setItem("isLogged", 0);
      setShowAlert(true);
      setAlertMessage("Error while creating the account !");
    });
  }

  return (
    <div className="submit-container">
      <div className="submit" onClick={() => signUp(username, password)}>Sign Up</div>
      <div className="submit gray" onClick={() => setAction("Login")}>Login</div>
    </div>
  );
}

function loginButtons({ setAction, setIsLogged, setShowAlert, setAlertMessage, username, password }) {
  const logIn = (username, password) => {
    if (username === "" || password === "") {
      setShowAlert(true);
      setAlertMessage("Please fill all the fields !");
      return;
    }

    expressServer.logIn(username, password).then((response) => {
      if (response.status === 200) {
        setIsLogged(true);
        setShowAlert(false);
        setAlertMessage("");
        // console.log(response.data[0].id);
        localStorage.setItem("currentUserId", response.data[0].id);
        localStorage.setItem("isLogged", 1);
      }
    }).catch((error) => {
        console.log("Error : " + error);

      setIsLogged(false);
      setShowAlert(true);
      localStorage.setItem("isLogged", 0);

      if (error === "AxiosError: Request failed with status code 400") {
        setAlertMessage("No user with this name or this password !");
      } else {
        setAlertMessage("Error while logging in !");
      }
    });
  }

  return (
    <div className="submit-container">
      <div className="submit gray" onClick={() => setAction("Sign Up")}>Sign Up</div>
      <div className="submit" onClick={() => logIn(username, password)}>Login</div>
    </div>
  );
}

function Login({ setIsLogged }) {
  const [action, setAction] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <div className="iconPlaceholder">
              <IonIcon icon={person} className="iconStyle"/>
            </div>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input">
            <div className="iconPlaceholder">
              <IonIcon icon={lockClosed} className="iconStyle"/>
            </div>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="iconPlaceholder">
              <IonIcon icon={showPassword ? eye : eyeOff} onClick={() => setShowPassword(!showPassword)} className="iconStyle"/>
            </div>
          </div>
        </div>

        {showAlert ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible className="col-md-10">
              <Alert.Heading>
                Error while {action === "Sign Up" ? "signing up" : "logging in"}:
              </Alert.Heading>
              <p>{alertMessage}</p>
            </Alert>
          </div>
        ) : null}

        {action === "Sign Up"
          ? signUpButtons({ setAction, setIsLogged, setShowAlert, setAlertMessage, username, password })
          : loginButtons({ setAction, setIsLogged, setShowAlert, setAlertMessage, username, password })}
      </div>
    </div>
  );
}

export default Login;
