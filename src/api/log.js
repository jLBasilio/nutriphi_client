import axios from 'axios';

const url = '/api/consumed';

export const addToLog = foodInfo => axios.post(`${url}/add`, foodInfo);
