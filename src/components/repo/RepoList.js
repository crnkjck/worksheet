import React , { useState } from "react";
import Repo from "./Repo"
import {connect} from "react-redux";
import {ListGroup, Accordion, Card, Container} from "react-bootstrap";
import {loadUserRepos} from "../../store/actions/repoActions"





const RepoList = ({repos,currentRepo,currentBranch,octokit}) => {

    const getRepo = async (item) => {
        /*
        var foundRepo = await octokit.repos.get({
            owner:item.owner.login,
            repo:item.name
          });

        console.log(foundRepo)
        */

        var repoContents = await octokit.repos.getContents({
            owner: item.owner.login,
            repo: item.name
          });
        
        console.log(repoContents)
    } 

    const renderRepo = (item, index) => {
        return(
            <Repo item = {item} octokit={octokit} key={item.name} currentRepo={currentRepo} currentBranch={currentBranch}/>
        )
    }
   
    return(

        <Container>
            {repos && repos.map((item,i) => {
                return( 
                    renderRepo(item,i)
                )
            })}
        </Container>
    )
}



export default RepoList