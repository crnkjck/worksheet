import React, { useState, useRef, useEffect } from 'react'
import {connect} from "react-redux";
import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup, DropdownButton, Dropdown, Container} from "react-bootstrap";
import {updateCard,createCard,deleteCard, updateOrder, loadCards} from "../../store/actions/cardActions"
import {useDrag, useDrop } from "react-dnd"
import { ItemTypes } from '../../constants/ItemTypes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


import Editor from "../solvers/tableauEditor/src/Editor.elm"
import Elm from 'react-elm-components'



const Solver = ({type, content, handleChange}) => {

    const setupPorts = (ports) => {
        ports.print.subscribe(function () {
          });
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
