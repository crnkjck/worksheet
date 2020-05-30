import React from 'react'
import {Container} from "react-bootstrap";
import Editor from "../solvers/tableauEditor/src/Editor.elm"
import Elm from 'react-elm-components'
import ResolutionEditor from "../solvers/resolutionEditor/src/embed.js"

const Solver = ({type, content, handleChange}) => {
    const setupPorts = (ports) => {
        ports.cache.subscribe(function (tableauData) {
            handleChange(tableauData)
        });
    }

    const renderSolver = () => {
        if(type === "tableauEditor"){
            return (
                <Container className="tableauEditor-container" fluid>
                    <Elm src={Editor.Elm.Editor} flags={content ? content : null} ports = {setupPorts}></Elm>
                </Container> 
            )
        }else if(type === "resolver"){
            return (
                <Container fluid>
                    <ResolutionEditor initState = {content} changeState = {handleChange}></ResolutionEditor>
                </Container> 
            )
        }else{
            return(
                <div/>
            )
        }    
    }

    return(      
        renderSolver()        
    )}
   


    
export default Solver
