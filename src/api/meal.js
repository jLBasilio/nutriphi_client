import axios from 'axios';

const url = '/api/meal/';

export const getMeal = uid => axios.get(`${url}/get/${uid}`);

export const addMeal = mealInfo => axios.post(`${url}/add/${mealInfo.user}`, mealInfo);
