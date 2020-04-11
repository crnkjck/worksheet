import React from 'react';
import {Navbar, Button,Nav,NavDropdown} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { githubSignin,githubSignout } from "../../store/actions/authActions";
import {connect} from "react-redux";

const Navigation = ({githubSignin,githubSignout, user,cardOrder,cards, state}) => {

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
                <LinkContainer to = '/repo'>
                    <Nav.Link className="text-white">Repozitáre</Nav.Link>
                </LinkContainer>
            </Nav>
            <Button onClick={() => console.log(user)}>User</Button>
            <Button onClick={() => console.log(cardOrder)}>Order</Button>
            <Button onClick={() => console.log(cards)}>Cards</Button>
            <Button onClick={() => console.log(state)}>State</Button>
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
        githubSignout: () => dispatch(githubSignout())        
        
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
