import React , { useState } from "react";
import {ListGroup, Accordion, Card} from "react-bootstrap";
import RepoBranch from "./RepoBranch";





const RepoBranchList = ({setRepoDetails,repos,octokit}) => {

    const renderRepoBranch = (item, index) => {
        return(
            <RepoBranch key={item.id} repo = {item} octokit={octokit} setRepoDetails={setRepoDetails}>
                {item.name}
           </RepoBranch>  
        )
    }
   

    return(
        <Accordion>
            {repos && repos.map((item,i) => {
                return( 
                    renderRepoBranch(item,i)
                )
            })}
        </Accordion>  
    )
}


export default RepoBranchList