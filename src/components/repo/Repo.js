import React, { useState }  from 'react'
import {connect} from "react-redux";
import {Card, ListGroup} from "react-bootstrap";
import { Base64 } from 'js-base64';
import {loadCards} from "../../store/actions/cardActions"
import {loadFile} from "../../store/actions/repoActions"


const Repo = ({item,octokit,currentBranch,repoContents, addToPath, loadCards,loadFile}) => {
    //const [repoContents,setRepoContents] = useState([])
    const [repoDetail, setRepoDetail] = useState([])
    var currentRepo = null

    const getRepoReadme = async () =>{
        var {data} = await octokit.repos.getContents({
            owner: item.owner.login,
            repo: item.name,
            ref: currentBranch,
            path: "README.md",
            mediaType:{
                format:"html"
            }
          })
          
          setRepoDetail(data) 
    }

    const renderListItem = (e) => {
        return(
            <ListGroup.Item key={e.sha} onClick={()=>renderItemInfo(e)}>
                {e.name}
            </ListGroup.Item>
        )
    }

    const renderItemInfo = async (e) => {
        //console.log(e)
        if(e.type === "dir"){
            addToPath(e.path)
        }else{
            await octokit.repos.getContents({
                owner:item.owner.login,
                repo:item.name,
                path:e.path,
                ref:currentBranch,
                mediaType:{
                    format:"raw"
                }
                }).then((item) => {
                    try{
                        loadFile(e)
                        loadCards(item,e)             
                    }catch(err){
                        console.log(err)
                        setRepoDetail(item.data) 
                    }
                });
            //setRepoDetail(data)  
        }
    }


    try{
        getRepoReadme()
    }catch(e){
        console.log(e)
        console.log("No README.md in this folder")
    }
    
    return(
            <Card bg="white" text="black" >

                    <Card.Body>
                        <ListGroup variant="flush">
                            {repoContents && repoContents.map( (e) => {
                                return( 
                                    renderListItem(e)
                                )
                            })}
                        </ListGroup>
                    {
                        repoDetail.length ? 
                            <div dangerouslySetInnerHTML={{__html:repoDetail}}/>       
                        :
                            null
                    }
                    </Card.Body>              
            </Card> 
    )
}
   


const mapDispatchToProps = (dispatch) => {
    return {
        loadCards: (item) => dispatch(loadCards(item)),
        loadFile: (file) => dispatch(loadFile(file))
    }
}

export default connect(null,mapDispatchToProps)(Repo)

