import firebase from "firebase/app"
 
 export const githubSignin = () => {
        var provider = new firebase.auth.GithubAuthProvider();
        var resToken = ""
        var resUser = ""
        firebase.auth().signInWithPopup(provider)
        .then((result) => {        
            resToken = result.credential.accessToken;
            resUser = result.user;
            /*
            console.log(resToken)
            console.log(resUser)
            */
            return {resToken,resUser}
            /*
            this.setState({
                token: resToken,
                user: resUser
            })
            */
         })
         .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code)
            console.log(error.message)
         }) 
    }