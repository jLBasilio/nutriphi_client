import axios from 'axios';

const url = '/api/user';

export const login = ({ userName, password }) => axios.post(`${url}/login`, { userName, password });

export const logout = () => axios.post(`${url}/logout`);

export const getSession = () => axios.post(`${url}/session`);
