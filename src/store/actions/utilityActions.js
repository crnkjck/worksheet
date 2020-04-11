export const initOctokit = (accessToken, userAgent = "NikolajKn", baseUrl="https://api.github.com") => {
    octokit = new Octokit({
        auth: accessToken,
        userAgent: userAgent,
        baseUrl: baseUrl
    })
    return (dispatch) => {
        dispatch({
            type: "INIT_OCTOKIT",
            octokit
        })
    }
}

export const closeOctokit = () => {
    return (dispatch) => {
        dispatch({
            type: "CLOSE_OCTOKIT"
        })
    }
}