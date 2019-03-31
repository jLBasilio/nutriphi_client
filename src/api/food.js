import axios from 'axios';

const url = '/api/food';

export const getFoodClass = ({ skip, take, foodClass }) => (
  foodClass
    ? axios.get(`${url}/find/${foodClass}?skip=${skip}&take=${take}`)
    : axios.get(`${url}/find/all?skip=${skip}&take=${take}`)
);

export const searchFood = ({
  skip, take, q, foodClass
}) => (
  axios.get(`${url}/search/${foodClass}?skip=${skip}&take=${take}&q=${q}`)
);
