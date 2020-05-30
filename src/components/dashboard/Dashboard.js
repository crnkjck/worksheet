import React, {Component} from "react";
import SecondNavbar from "../layout/SecondNavbar";
import CardList from "../todo/CardList";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Container, Row, Col, Spinner} from "react-bootstrap";
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { updateOrder,createCard } from "../../store/actions/cardActions";




class Dashboard extends Component{
    
    constructor(props){
        super(props)
        console.log(props)
        this.state = {
            task:"",
            order:[]
        }
    }
    
    names = []
    componentDidMount(){
        this.names = []
        this.setState({task:this.props.cardOrder[0].id,order:this.props.cardOrder[0].order})
        this.props.cardOrder.map(item => (
            this.names = [...this.names,item.id]
            ))   
    }

    componentDidUpdate(prevProps){
        
        if(prevProps.cardOrder !== this.props.cardOrder){
            this.props.cardOrder.map(item => (
                this.state.task === item.id ? 
                    this.setState({task:item.id, order:item.order})
                : 
                    console.log("")
            ))
        }
    }

    changeOrder = (item) => {
        this.setState({order:item})
        this.props.updateOrder(this.state.order, this.state.task)
    } 

    changeTask = (name) => {
        this.props.cardOrder.map(item => (
            name === item.id ? 
                this.setState({task:item.id, order:item.order})
            : 
                console.log("")
        ))
    }

   
    render(){      
        if(this.state.id === ""){
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
            
            var cards = this.props.cards
            var taskCards = Object.values(this.state.order).map(item => ({...cards[item], id: item}) )
                        
            return(
                <Row >
                    <Col sm = {2} >
                        <div className="secondnav">
                            <SecondNavbar names ={this.names} changeTask = {this.changeTask} />
                        </div>     
                    </Col>
                  
                    <Col sm = {9}>  
                        <DndProvider backend={HTML5Backend}>
                            <CardList cards = {taskCards} cardOrder={this.state.order} changeOrder={this.changeOrder} taskName = {this.state.task}/> 
                        </DndProvider>
                    </Col>
                    <Col />
                </Row>
         
            )
        }
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateOrder: (cardOrder, taskName) => dispatch(updateOrder(cardOrder,taskName)),
        createCard: (cardOrder,taskName,insertIndex) => dispatch(createCard(cardOrder,taskName,insertIndex))
    }
}


export default connect(null,mapDispatchToProps)(Dashboard)




/*

class Dashboard extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            task:"",
            order:[]
        }
    }
    
    names = []
    componentDidMount(){
        this.names = []
        this.setState({task:this.props.cardOrder[0].id,order:this.props.cardOrder[0].order})
        this.props.cardOrder.map(item => (
            this.names = [...this.names,item.id]
            ))   
    }

    componentDidUpdate(prevProps){
        
        if(prevProps.cardOrder !== this.props.cardOrder){
            this.props.cardOrder.map(item => (
                this.state.task === item.id ? 
                    this.setState({task:item.id, order:item.order})
                : 
                    console.log("")
            ))
        }
    }

    changeOrder = (item) => {
        this.setState({order:item})
        this.props.updateOrder(this.state.order, this.state.task)
    } 

    changeTask = (name) => {
        this.props.cardOrder.map(item => (
            name === item.id ? 
                this.setState({task:item.id, order:item.order})
            : 
                console.log("")
        ))
    }

   
    render(){      
        if(this.state.id === ""){
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
            
            var cards = this.props.cards
            var taskCards = Object.values(this.state.order).map(item => ({...cards[item], id: item}) )
                        
            return(
                <Row >
                    <Col sm = {2} >
                        <div className="secondnav">
                            <SecondNavbar names ={this.names} changeTask = {this.changeTask} />
                        </div>     
                    </Col>
                  
                    <Col sm = {9}>  
                        <DndProvider backend={HTML5Backend}>
                            <CardList cards = {taskCards} cardOrder={this.state.order} changeOrder={this.changeOrder} taskName = {this.state.task}/> 
                        </DndProvider>
                    </Col>
                    <Col />
                </Row>
         
            )
        }
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateOrder: (cardOrder, taskName) => dispatch(updateOrder(cardOrder,taskName)),
        createCard: (cardOrder,taskName,insertIndex) => dispatch(createCard(cardOrder,taskName,insertIndex))
    }
}


export default connect(null,mapDispatchToProps)(Dashboard)
*/
















/*
const mapStateToProps = (state) => {
    return {
        todos:state.firestore.data.todos,
        cardOrder:state.firestore.ordered.cardOrder
    }
}




export default compose(firestoreConnect([{collection:'todos'},{collection:'cardOrder'}]),connect(mapStateToProps))(Dashboard)


else{
            const changeTask = (name) => {
                this.setState({task:name})
            }
    
            
            console.log(this.props.cardOrder[0])
            
            this.setState({...this.state, order : this.props.cardOrder[0].order})
            console.log(this.state)
        
            const changeOrder = (item) => {
                this.setState({task:item.id, order:item.order})
                console.log(this.state)
        } 

        
       
            var names = []
            console.log("DASHBOARD TODOS",this.props)
            this.props.cardOrder.map(item => (
                names = [...names,item.id],
                item.id === this.state.task ? 
                    changeOrder(item)
                : 
                    console.log("NIE HURA")
            ))

            return(
                
                <Row>
                    <Col sm = {2} >
                        <div className="secondnav">
                            <SecondNavbar names ={names} changeTask = {changeTask} />
                        </div>
                        
                    </Col>
                  
                    <Col sm = {9}>  
                        <DndProvider backend={HTML5Backend}>
                            <TodoList todos = {todos} cardOrder={cardOrder} taskName = {this.state.task}/> 
                        </DndProvider>
                    </Col>
                    <Col />
                </Row>
             
                
            )
            }
    }
}

*/