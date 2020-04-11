import firebase from "firebase/app"
import { Octokit } from "@octokit/rest"


export const githubSignin = () =>{
    const provider = new firebase.auth.GithubAuthProvider();
    return(dispatch) =>{
        provider.addScope('repo')
        firebase.auth().signInWithPopup(provider)
        .then((result) => {  
            var octokit = new Octokit({
                auth: result.credential.accessToken,
                userAgent: "NikolajKn",
                baseUrl: "https://api.github.com"
            }) 
            dispatch({
                type:"LOGIN_USER",
                data:result,
                octokit
            })   
            
            
        })
        .catch((err) => {
            dispatch({
                type: "LOGIN_USER_ERROR",
                err
            })
        })
    }
}


export const githubSignout = () =>{
    return(dispatch)=>{
        firebase.auth().signOut()   
        .then(() => {
            dispatch({
                type:"LOGOUT_USER",    
            })   
        })
        .catch((err) => {
            dispatch({
                type: "LOGOUT_USER_ERROR",
                err
            })
        })

    }
 }