/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (payload) => api.post(`/top5list/`, payload)
export const getAllTop5Lists = () => api.get(`/top5lists/`)
export const getTop5ListPairs = () => api.get(`/top5listpairs/`)
export const updateTop5ListById = (id, payload) => api.put(`/top5list/${id}`, payload)
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)
export const updateUser = (email,payload) => api.put(`/user/${email}`,payload)
export const getAllUserTop5Lists = () => api.get(`/user`)
export const getUserById = (id) => api.get(`/user/${id}`)

export const publishTop5List = (payload) => api.post(`/publishedTop5Lists/`, payload)
export const getAllPublishedTop5List = () => api.get(`/publishedTop5Lists/`)
export const deletePublishedTop5ListById = (id) => api.delete(`/publishedTop5Lists/${id}`)
export const updatePublishedTop5ListById = (id, payload) => api.put(`/publishedTop5Lists/${id}`, payload)
export const getPublishedTop5ListPairs = () => api.get(`/publishedTop5Lists/`)

export const createCommunityTop5List = (payload) => api.post(`/communityTop5Lists/`, payload)
export const getAllCommunityTop5List = () => api.get(`/communityTop5Lists/`)
export const deleteCommunityTop5ListById = (id) => api.delete(`/communityTop5Lists/${id}`)
export const updateCommunityTop5ListById = (id, payload) => api.put(`/communityTop5Lists/${id}`, payload)
export const getCommunityTop5ListPairs = () => api.get(`/communityTop5Lists/`)
export const getCommunityTop5ListById = (id) => api.get(`/communityTop5Lists/${id}`)



const apis = {
    createTop5List,
    getAllTop5Lists,
    getTop5ListPairs,
    updateTop5ListById,
    deleteTop5ListById,
    getTop5ListById,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    getAllUserTop5Lists,
    getUserById,

    publishTop5List,
    getAllPublishedTop5List,
    deletePublishedTop5ListById,
    updatePublishedTop5ListById,
    getPublishedTop5ListPairs,

    createCommunityTop5List,
    getAllCommunityTop5List,
    deleteCommunityTop5ListById,
    updateCommunityTop5ListById,
    getCommunityTop5ListPairs,
    getCommunityTop5ListById
}

export default apis
