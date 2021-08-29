import React, { useState, useEffect } from "react";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";
import mockUser from "./mockData.js/mockUser";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser, ] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  // Request loading
  const [request, setRequest] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Error
  const [error, setError] = useState({ show: false, msg: ''})

  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    try {
      const response = await axios.get(`${rootUrl}/users/${user}`)
      if (response) {
        setGithubUser(response.data)
        const {login, followers_url} = response.data
        // Repos
        try {
          const res = await axios.get(`${rootUrl}/users/${login}/repos?per_page=100`)
          if (res) {
            setRepos(res.data)
          }
        } catch (err) {
          console.log('test')
        }
        // Followers
        try {
          const res = await axios.get(`${followers_url}?per_page=100`)
          if (res) {
            setFollowers(res.data)
          }
        } catch (err) {
          console.log('test')
        }
      }
      checkRequest()
      setIsLoading(false)
    } catch (err) {
      toggleError(true, 'there are no user with that username')
    }
  }

  const checkRequest = () => {
    axios.get(`${rootUrl}/rate_limit`)
        .then(({data}) => {
          let {rate: {remaining} } = data
            setRequest(remaining)
            if (remaining === 0) {
              // throw an error
              toggleError(true, 'Sorry, you have exceed your hourly rate limit!')
            }
        })
        .catch(err => console.log(err))
  }

  useEffect(checkRequest, [])
  // Error
  const toggleError = (show = false, msg= '') => {
    setError({show, msg})
  }

  return (
    <GithubContext.Provider value={{ githubUser, repos, followers, request, error, searchGithubUser, isLoading }}>
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
