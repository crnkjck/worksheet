import React, {Component} from "react";
import NoticeList from "../notice/NoticeList";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Container, Row, Col, Spinner} from "react-bootstrap";




class NoticeBoard extends Component{
    
    render(){
        const {notices} = this.props;
        console.log(notices)
       

        
        if(!notices){
            return(
                <Container>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </Container>
            )
        }else{
            
            console.log("NOTICEBOARD notice",this.props)
            return(
                
                <Row>
                <Col sm = {1}/>  
                    <Col sm = {10}>  
                        
                        <NoticeList notices = {notices}/> 
                       
                    </Col>
                <Col sm = {1}/>     
                </Row>
             
                
            )
            }
    }
}


const mapStateToProps = (state) => {
    return {
        notices:state.firestore.data.notices
    }
}




export default compose(firestoreConnect([{collection:'notices'}]),connect(mapStateToProps))(NoticeBoard)

