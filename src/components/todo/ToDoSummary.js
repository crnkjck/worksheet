import React from "react";
import todoReducer from "../../store/reducers/todoReducer";

const ToDoSummary = ({todo}) => {

    return(
        <div className="card z-depth-0 project-summary">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{todo.title}</span>
                    <p> Posted by Niko</p>
                    <p className="grey-text">3.10.2019</p>

                </div>
            </div>
    )
}

export default ToDoSummary;