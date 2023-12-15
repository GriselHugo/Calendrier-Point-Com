import React from 'react';

function Home() {
    const currentUserId = localStorage.getItem("currentUserId");

    return (
        <div>
            <h1>Home</h1>
            <p>Current user id : {currentUserId}</p>
        </div>
    );
}

export default Home;
