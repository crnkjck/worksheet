import React, {Component} from "react";
import RepoBoard from "./RepoBoard";




class RepoWrapper extends Component{
    constructor(props) {
        super(props);
        console.log(props)
        this.routeParam = props.match.params.parameterToAccess;
        
      }
    render(){
            return(
                <RepoBoard></RepoBoard>               
            )
    }
}


export default RepoWrapper