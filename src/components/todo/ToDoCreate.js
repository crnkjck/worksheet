import React from 'react'
import {connect} from "react-redux"
import {createTodo} from "../../store/actions/todoActions"
import {useDrag} from "react-dnd"
import { ItemTypes } from '../../constants/ItemTypes';


const ToDoCreate = () => {

    const [{isDragging}, drag] = useDrag({
        item : {type : ItemTypes.TODO},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
   

        return (
            <div className="container">
                <form onSubmit ={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Add ToDo</h5>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    </div>
                    <div className="input-field">
                        <button className="btn green lighten-1 z-depth-0">Add</button>
                    </div>
                </form>
                
            </div>
        )
    }



const mapDispatchToProps = (dispatch) => {
    return {
        createTodo: (todo) => dispatch(createTodo(todo))
    }
}

export default connect(null,mapDispatchToProps)(ToDoCreate)


/*
class ToDoCreate extends Component {
    state = {
        title:"",
        content: ""
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.createTodo(this.state)
        this.props.history.push("/")
    }



    render() {
        return (
            <div className="container">
                <form onSubmit ={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Add ToDo</h5>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    </div>
                    <div className="input-field">
                        <button className="btn green lighten-1 z-depth-0">Add</button>
                    </div>
                </form>
                
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        createTodo: (todo) => dispatch(createTodo(todo))
    }
}

export default connect(null,mapDispatchToProps)(ToDoCreate)
*/