import { useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import './Navbar.css';

import Button from 'react-bootstrap/Button'

function Navbar() {
  const navRef = useRef(null);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive-nav");
  }

  const logOut = () => {
    localStorage.setItem("isLogged", 0);
    localStorage.setItem("currentUserId", 0);
    window.location.replace('/');
  }

  return (
    <header id="navHeader">
      <h3>Calendar-point-com</h3>

      <nav id="navBar" ref={navRef}>
        <Link to="/">Home</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/todo">Todo</Link>
        <Link to="/profil">Profil</Link>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
        <Button variant="danger" onClick={logOut}>Logout</Button>
      </nav>
      <button id="navBurger" className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;