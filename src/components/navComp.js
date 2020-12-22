import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
export default function NavComp() {
  const { logout, currentUser } = useAuth();
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Crowd Tracker</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/home" className="nav-link">
            Home
          </Link>
        </Nav>
        <Nav>
          {currentUser ? (
            <>
              <Link to="/" className="nav-link">
                MapView
              </Link>
              <Link to="/charts" className="nav-link">
                Charts
              </Link>

              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
}
