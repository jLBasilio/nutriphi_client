import axios from 'axios';

const url = '/api/food';

export const getFoodClass = ({ skip, take, foodClass }) => (
  foodClass
    ? axios.get(`${url}/find/?foodClass=${foodClass}&skip=${skip}&take=${take}`)
    : axios.get(`${url}/find/?skip=${skip}&take=${take}`)
);

export const getFoodCount = foodClass => (
  foodClass.length
    ? axios.get(`${url}/find/count/?foodClass=${foodClass}`)
    : axios.get(`${url}/find/count`)
);
