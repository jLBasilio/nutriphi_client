import axios from 'axios';

const url = '/api/favorite';

export const getFavoriteIds = uid => axios.get(`${url}/find/id/${uid}`);

export const fetchFavorites = ({ skip, take, uid }) => (
  axios.get(`${url}/find/food/${uid}?skip=${skip}&take=${take}`)
);
