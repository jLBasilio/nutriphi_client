import axios from 'axios';

const url = '/api/food';

export const getFoodClass = ({ skip, take, foodClass }) => (
  axios.get(`${url}/find/${foodClass}?skip=${skip}&take=${take}`)
);

export const searchFood = ({
  skip, take, q, foodClass
}) => (
  axios.get(`${url}/search/${foodClass}?skip=${skip}&take=${take}&q=${q}`)
);

export const searchRaw = ({ q, foodClass }) => (
  axios.get(`${url}/search/raw/${foodClass}?&q=${q}`)
);

export const getRec = body => axios.post(`${url}/rec`, body);
