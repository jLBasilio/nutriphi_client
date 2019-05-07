import axios from 'axios';

const url = '/api/meal';

export const fetchMeal = ({ uid, skip, take }) => axios.get(`${url}/find/${uid}?skip=${skip}&take=${take}`);

export const searchMeal = qInfo => (
  axios.get(`${url}/search/${qInfo.uid}?q=${qInfo.q}&skip=${qInfo.skip}&take=${qInfo.take}`)
);

export const addMeal = mealInfo => axios.post(`${url}/add/${mealInfo.user}`, mealInfo);

export const editMeal = mealInfo => axios.put(`${url}/edit?mealId=${mealInfo.id}`, mealInfo);

export const deleteMeal = ({ uid, mealId }) => axios.delete(`${url}/delete/${uid}?mealId=${mealId}`);
