import React from 'react';
import {Link} from 'react-router-dom';
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import {Navbar, Button,Nav,NavDropdown} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'



const Navigation = () => {
    return(
       <Navbar bg="dark" variant= "dark" expand="lg">
            <LinkContainer to = '/'>
                <Navbar.Brand className="text-white">Matematika 4</Navbar.Brand>
            </LinkContainer>
            <Nav className="mr-auto">
                <LinkContainer to = '/'>
                    <Nav.Link className="text-white">Domov</Nav.Link>
                </LinkContainer>
                <LinkContainer to = '/tasks'>
                    <Nav.Link className="text-white">Úlohy</Nav.Link>
                </LinkContainer>
                <LinkContainer to = '/notice'>
                    <Nav.Link className="text-white">Oznámenia</Nav.Link>
                </LinkContainer>
            </Nav>
            
            <Nav className="xs-2">
                <NavDropdown 
                title="Nikolaj Kniha" id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">Nastavenie</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item eventKey="4.4">Odhlásenie</NavDropdown.Item>
                </NavDropdown>
             </Nav>
            
         
            
           
       </Navbar>
    )
}

export default Navigation;


/*
 <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <Link to = '/' className = "brand-logo">PokemonPlan</Link>
                <SignedInLinks/>
                <SignedOutLinks/>
            </div>
        </nav>
        */