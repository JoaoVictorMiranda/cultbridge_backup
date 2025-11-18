import axios from 'axios';

const apiTMDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
});

export default apiTMDB;