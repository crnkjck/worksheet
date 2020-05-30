import React from 'react';
import {Navbar, Button,Nav} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { githubSignin,githubSignout, localStorageSignin } from "../../store/actions/authActions";
import {connect} from "react-redux";


const Navigation = ({githubSignin,githubSignout, user}) => {
   
    return(  
       <Navbar bg="dark" variant= "dark" expand="lg">
            <LinkContainer to = '/'>
                <Navbar.Brand className="text-white">Matematika 4</Navbar.Brand>
            </LinkContainer>

            <Nav className="mr-auto">   
            </Nav>
                
            <Nav className="xs-2">
                {
                user ? 
                <Button variant="outline-light" onClick={()=> githubSignout()}>Log Out</Button>
               : 
                <Button variant="outline-light" onClick={()=> githubSignin()}>Log in</Button>
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
        cardOrder: state.card.cardOrder
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation)
