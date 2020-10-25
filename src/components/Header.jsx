import React from 'react';
import { Navbar, NavLink, Nav } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/dashboard">Parking Management</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mr-auto">
                    <NavLink href="/dashboard">Dashboard</NavLink> 
                    <NavLink href="/initialize">Initialize</NavLink> 
                    <NavLink href="/report">Reports</NavLink> 
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default Header;