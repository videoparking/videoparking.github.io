import axios from 'axios';

export default axios.create({
    baseURL: 'https://raw.githubusercontent.com/videoparking/zones/master/v1/',
//      baseURL: 'https://httpbin.org/status/404'
});
