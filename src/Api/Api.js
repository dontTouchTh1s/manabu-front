import axios from "axios";
import getCookie from "../Functions/GetCookie/GetCookie";

const sessionCookie = process.env.REACT_APP_SESSION_COOKIE_NAME;
const instance = axios.create({
    baseURL: 'http://localhost:8080/manabu',
    withCredentials: true
});
instance.interceptors.request.use(async (config) => {
    if (!getCookie(sessionCookie)) {
        await axios.post('http://localhost:8080/manabu/session', {withCredentials: true});
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
instance.interceptors.response.use(response => response,
    async (error) => {
        if (error.response) {
            if (error.response.status === 419) {
                await axios.post('http://localhost:8080/manabu/session', {withCredentials: true});
                return axios(error.config);
            }
        }
        return Promise.reject(error);
    });
export default instance
