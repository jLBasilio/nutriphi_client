import axios from 'axios';

const url = '/api/food';

export const getFoodAll = ({ skip, take }) => axios.get(`${url}/find/skip=${skip}&take=${take}`);

export const getFoodClass = ({ skip, take, foodClass }) => (
  axios.get(`${url}/find/?foodClass=${foodClass}&skip=${skip}&take=${take}`)
);
