import React , { useState } from "react";
import Repo from "./Repo"
import {connect} from "react-redux";
import {ListGroup, Accordion, Card} from "react-bootstrap";
import {loadUserRepos} from "../../store/actions/repoActions"





const RepoList = ({repos,octokit}) => {

    const alertClicked = () => {
        alert('You clicked the third ListGroupItem');
    }

    const getRepo = async (item) => {
        /*
        var foundRepo = await octokit.repos.get({
            owner:item.owner.login,
            repo:item.name
          });

        console.log(foundRepo)
        */

        var repoContents = await octokit.repos.getContents({
            owner:item.owner.login,
            repo:item.name
          });
        
        console.log(repoContents)
    } 

    const renderRepo = (item, index) => {
        return(
            /*
            <ListGroup.Item action onClick={() => getRepo(item)} key={item.id}>
                {item.name}
           </ListGroup.Item>  
           */
            <Repo item = {item} octokit={octokit} key={item.name}/>
        )
    }
   
    return(

        <Accordion>
            {repos && repos.map((item,i) => {
                return( 
                    renderRepo(item,i)
                )
            })}
        </Accordion>  
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}


export default connect(null,mapDispatchToProps)(RepoList)