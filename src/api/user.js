import axios from 'axios';

const url = '/api/user';

export const findUser = ({ userName }) => axios.get(`${url}/find/username/${userName}`);

export const signup = body => axios.post(`${url}/add`, body);

export const login = ({ userName, password }) => axios.post(`${url}/login`, { userName, password });

export const logout = () => axios.post(`${url}/logout`);

export const getSession = () => axios.post(`${url}/session`);
