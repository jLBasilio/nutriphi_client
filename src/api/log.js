import axios from 'axios';

const url = '/api/consumed';

export const fetchLogs = ({
  userId, date, skip, take
}) => axios.get(`${url}/find/${userId}?skip=${skip}&take=${take}&date=${date}`);

export const addToLog = foodInfo => axios.post(`${url}/add`, foodInfo);
