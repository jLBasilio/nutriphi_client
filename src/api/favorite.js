import axios from 'axios';

const url = '/api/favorite';

export const getFavoriteIds = uid => axios.get(`${url}/find/id/${uid}`);

export const fetchFavorites = ({ skip, take, uid }) => (
  axios.get(`${url}/find/food/${uid}?skip=${skip}&take=${take}`)
);

export const searchFavorites = ({
  uid, skip, take, q
}) => (
  axios.get(`${url}/search/${uid}?skip=${skip}&take=${take}&q=${q}`)
);

export const addToFavorites = ({ uid, foodId }) => (
  axios.post(`${url}/add/${uid}?foodId=${foodId}`)
);

export const deleteFromFavorites = ({ uid, foodId }) => (
  axios.delete(`${url}/delete/${uid}?foodId=${foodId}`)
);
