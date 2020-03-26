import React, { useState }  from 'react'
import {connect} from "react-redux";
import {Card, ListGroup} from "react-bootstrap";



const Repo = ({item,octokit,currentBranch,repoContents, addToPath}) => {
    console.log(currentBranch)
    //const [repoContents,setRepoContents] = useState([])
    const [repoDetail, setRepoDetail] = useState([])


    const getRepoData = async () => {
        var tempData = []
        var contents = await octokit.repos.getContents({
            owner:item.owner.login,
            repo:item.name,
            ref:currentBranch
          })
          console.log(contents)
          contents.data.map( (item) => {
            tempData = [...tempData,item]
        })
        //setRepoContents(tempData)   
    }
    //getRepoData()

    console.log(repoContents)

    const renderListItem = (e) => {
        return(
            <ListGroup.Item key={e.sha} onClick={()=>renderItemInfo(e)}>
                {e.name}
            </ListGroup.Item>
        )
    }

    const renderItemInfo = async (e) => {
        console.log(e)
        if(e.type === "dir"){
            addToPath(e.path)
        }else{
            var {data} = await octokit.repos.getContents({
                owner:item.owner.login,
                repo:item.name,
                path:e.path,
                ref:currentBranch,
                mediaType:{
                    format:"html"
                }
              });
              setRepoDetail(data)  
        }
         
          
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
                        <div>
                            ...
                        </div>
                    }

                    </Card.Body>
                
            </Card>
   
    )}
   
   



const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null,mapDispatchToProps)(Repo)

