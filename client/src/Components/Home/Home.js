import React, { useState, useEffect } from "react";
import expressServer from "../../api/server-express";

import "./Home.css";

function Home() {
    const currentUserId = parseInt(localStorage.getItem("currentUserId"));
    // console.log(currentUserId);
    // console.log(typeof currentUserId);

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [otherUsers, setOtherUsers] = useState([]);

    useEffect(() => {
        expressServer.getUsers().then((response) => {
          setUsers(response.data);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    useEffect(() => {
        const currentUser = users.filter((user) => user.id === currentUserId);
        if (currentUser.length > 0) {
            setCurrentUser(currentUser[0]);
        }

        const otherUsers = users.filter((user) => user.id !== currentUserId);
        if (otherUsers.length > 0) {
            setOtherUsers(otherUsers);
        }
    }, [users, currentUserId, setCurrentUser, setOtherUsers]);

    return (
        <div>
            <h1>Home</h1>

            <div className="homeContainer">
                <div className="homeContainerTitle">User logged in</div>
                {
                    !currentUser.id ? (
                        <p>No user logged in</p>
                    ) : (
                        <ul>
                        <li key={currentUser.id}>{currentUser.name} ({currentUser.id})</li>
                        </ul>
                    )
                }
            </div>

            <div className="homeContainer">
                <div className="homeContainerTitle">Other registered users :</div>
                {
                  otherUsers.length > 0 ? (
                    <ul>
                      {otherUsers.map((user) => (
                        <li key={user.id}>{user.name} ({user.id})</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun utilisateur à afficher</p>
                  )
                }
            </div>
        </div>
    );
}

export default Home;
