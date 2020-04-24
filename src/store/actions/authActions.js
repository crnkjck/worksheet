import firebase from "firebase/app"
import { Octokit } from "@octokit/rest"


export const localStorageSignin = () => {
    var user = JSON.parse(localStorage.getItem("user"))
    
    return(dispatch) =>{
        var octokit = new Octokit({
            auth: user.credential.oauthAccessToken,
            userAgent: "NikolajKn",
            baseUrl: "https://api.github.com"
        }) 
        dispatch({
            type: "LOGIN_USER",
            data: user,
            octokit
        })   
    }
}


export const githubSignin = () =>{
    const provider = new firebase.auth.GithubAuthProvider();
    return(dispatch) =>{
        provider.addScope('repo')
        firebase.auth().signInWithPopup(provider)
        .then((result) => {     
            localStorage.setItem("user", JSON.stringify(result))

            var octokit = new Octokit({
                auth: result.credential.accessToken,
                userAgent: "NikolajKn",
                baseUrl: "https://api.github.com"
            }) 
            dispatch({
                type: "LOGIN_USER",
                data: JSON.parse(JSON.stringify(result)),
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
            localStorage.setItem("user", "null")
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