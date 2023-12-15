import React, { useState, useEffect } from "react";
import expressServer from "../../api/server-express";

import "./Profil.css";

import { IonIcon } from "@ionic/react";
import { person } from "ionicons/icons";
import { lockClosed } from "ionicons/icons";
import { eye } from "ionicons/icons";
import { eyeOff } from "ionicons/icons";
import { chevronDown } from "ionicons/icons";
import { close } from "ionicons/icons";

function changeUsername({ username, newUsername, setNewUsername, setUsername, setOpenFormUsername }) {
  if (newUsername === "") {
    return;
  }

  expressServer.changeUsername(username, newUsername).then((response) => {
    if (response.status === 200) {
      console.log("Username changed !");
      setUsername(newUsername);
      setNewUsername("");
      setOpenFormUsername(false);
    } else if (response.status === 500) {
      console.log("Error while changing username !: " + response.data);
    }
  });
}

function changePassword({ username, oldPassword, newPassword, setOldPassword, setNewPassword, setOpenFormPassword }) {
  if (oldPassword === "" || newPassword === "") {
    return;
  }

  expressServer.changePassword(username, oldPassword, newPassword).then((response) => {
    if (response.status === 200) {
      console.log("Password changed !");
      setOldPassword("");
      setNewPassword("");
      setOpenFormPassword(false);
    } else if (response.status === 500) {
      console.log("Error while changing password !: " + response.data);
    } else if (response.status === 400) {
      console.log("Wrong password !");
    }
  });
}

function Profil() {
  const currentUserId = localStorage.getItem("currentUserId");

  const [username, setUsername] = useState("");

  const [newUsername, setNewUsername] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [openFormUsername, setOpenFormUsername] = useState(false);
  const [openFormPassword, setOpenFormPassword] = useState(false);

  useEffect(() => {
    expressServer.getUser(currentUserId).then((res) => {
      setUsername(res.data[0].name);
    });
  }, [currentUserId]);

  return (
  <div>
      <h1>Profil</h1>

      <div className="profil-info">
        <div className="profil-info-title">Id :</div>
        <div className="profil-info-content">- {currentUserId}</div>
      </div>

      <div className="profil-info">
        <div className="profil-info-title">Username :</div>
        <div className="profil-info-content">- {username}</div>
        <div className="profil-info-submit" onClick={() => setOpenFormUsername(!openFormUsername)}>
          Change username
          <IonIcon icon={openFormUsername ? close : chevronDown} className="iconStyleWhite"/>
        </div>
        {openFormUsername ? (
          <div className="profil-info-inputs">
            <div className="profil-info-input">
              <div className="littleIconPlaceHolder">
                <IonIcon icon={person} className="iconStyleGrey"/>
              </div>
              <input type="text" placeholder="New username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            </div>
            <div className="profil-info-submit" onClick={() => changeUsername({ username, newUsername, setNewUsername, setUsername, setOpenFormUsername })}>Change username</div>
          </div>

        ) : (
            ""
          )
        }
      </div>

      <div className="profil-info">
        <div className="profil-info-title">Password :</div>
        {/* <div className="profil-info-content">{password}</div> */}
        <div className="profil-info-submit" onClick={() => setOpenFormPassword(!openFormPassword)}>
          Change password
          <IonIcon icon={openFormPassword ? close : chevronDown} className="iconStyleWhite"/>
        </div>
        {openFormPassword ? (
          <div className="profil-info-inputs">
          <div className="profil-info-input">
            <div className="littleIconPlaceHolder">
              <IonIcon icon={lockClosed} className="iconStyleGrey"/>
            </div>
            <input  type={showOldPassword ? "text" : "password"} placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <div className="littleIconPlaceHolder">
              <IonIcon icon={showOldPassword ? eye : eyeOff} onClick={() => setShowOldPassword(!showOldPassword)} className="iconStyleGrey"/>
            </div>
          </div>
          <div className="profil-info-input">
            <div className="littleIconPlaceHolder">
              <IonIcon icon={lockClosed} className="iconStyleGrey"/>
            </div>
            <input type={showNewPassword ? "text" : "password"} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <div className="littleIconPlaceHolder">
              <IonIcon icon={showNewPassword ? eye : eyeOff} onClick={() => setShowNewPassword(!showNewPassword)} className="iconStyleGrey"/>
            </div>
          </div>
          <div className="profil-info-submit" onClick={() => changePassword({ username, oldPassword, newPassword, setOldPassword, setNewPassword, setOpenFormPassword })}>Change password</div>
        </div>
        ) : (
          ""
        )}
      </div>
  </div>
  );
}

export default Profil;
