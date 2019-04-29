import axios from 'axios';

const url = '/api/user';

export const findUser = ({ userName }) => axios.get(`${url}/find/username/${userName}`);

export const getUser = uid => axios.get(`${url}/find/id/${uid}`);

export const signup = body => axios.post(`${url}/add`, body);

export const login = ({ userName, password }) => axios.post(`${url}/login`, { userName, password });

export const logout = () => axios.post(`${url}/logout`);

export const getSession = () => axios.post(`${url}/session`);

export const editHealth = userInfo => axios.put(`${url}/edit/${userInfo.id}`, userInfo);
