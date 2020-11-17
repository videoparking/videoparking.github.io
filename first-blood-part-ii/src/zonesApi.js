import axios from 'axios';

const BASE_URL = process.env.PUBLIC_URL;
// const BASE_URL = 'https://github.com/videoparking/zones/raw/main/videoparking_zones/data/v1/'; // Not working due to CORS

export default axios.create({
    baseURL: BASE_URL + '/zones-data/v1/'
//      baseURL: 'https://httpbin.org/status/404'
});
