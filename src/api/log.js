import axios from 'axios';

const url = '/api/consumed';

export const fetchLogs = ({ userId, date }) => axios.get(`${url}/find/${userId}?date=${date}`);

export const fetchPeriod = ({ userId, date, period }) => axios.get(`${url}/find/${userId}?date=${date}&period=${period}`);

export const fetchProgress = uid => axios.get(`${url}/find/progress/daily/${uid}`);

export const fetchClassDist = uid => axios.get(`${url}/find/progress/class/${uid}`);

export const addToLog = foodInfo => axios.post(`${url}/add`, foodInfo);

export const addMeal = logs => axios.post(`${url}/add/meal`, logs);

export const editLog = logInfo => axios.put(`${url}/edit/${logInfo.id}`, logInfo);

export const deleteLog = consumedId => axios.delete(`${url}/delete/${consumedId}`);
