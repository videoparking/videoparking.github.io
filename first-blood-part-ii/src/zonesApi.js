import axios from 'axios';

export default axios.create({
    baseURL: process.env.PUBLIC_URL + '/zones-data/v1/'
//      baseURL: 'https://httpbin.org/status/404'
});
