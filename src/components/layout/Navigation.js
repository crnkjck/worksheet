import React from 'react';
import {Navbar, Button,Nav,NavDropdown} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { githubSignin,githubSignout, localStorageSignin } from "../../store/actions/authActions";
import {connect} from "react-redux";

const Navigation = ({githubSignin,githubSignout, user,cardOrder,cards, state,localStorageSignin }) => {

    return(
       <Navbar bg="dark" variant= "dark" expand="lg">
            <LinkContainer to = '/'>
                <Navbar.Brand className="text-white">Matematika 4</Navbar.Brand>
            </LinkContainer>
            <Nav className="mr-auto">
            
            </Nav>
            {/*
            <Nav className="mr-auto">
                <LinkContainer to = '/notice'>
                    <Nav.Link className="text-white">Oznámenia</Nav.Link>
                </LinkContainer>
            </Nav>
            
                <Button onClick={() => console.log(user)} disabled={cards.working}>User</Button>
                <Button onClick={() => console.log(cardOrder)}>Order</Button>
                <Button onClick={() => console.log(cards)}>Cards</Button>
                <Button onClick={() => console.log(state)}>State</Button>
                <Button onClick={() => console.log(JSON.parse(localStorage.getItem("user")))}>localStorage</Button>
                <Button onClick={() => console.log(Date.now())}>Test</Button>*/
                <Button onClick={() => console.log(state)}>State</Button>
            }
            

            <Nav className="xs-2">
                {
                user ? 
                    <NavDropdown title={user.additionalUserInfo.username} id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1" onClick={()=> githubSignout()}>Log Out</NavDropdown.Item>
                    </NavDropdown> 
                : 
                    
                    <NavDropdown title="Anonymous" id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1" onClick={()=> githubSignin()}>Log In</NavDropdown.Item>
                    </NavDropdown>

                }            
             </Nav>        
       </Navbar>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        githubSignin: () => dispatch(githubSignin()),
        githubSignout: () => dispatch(githubSignout()),
        localStorageSignin: () => dispatch(localStorageSignin())    
        
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        cards: state.card,
        cardOrder: state.card.cardOrder,
        state: state
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation)
