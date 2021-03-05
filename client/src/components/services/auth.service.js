import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL_USER

export const register = (user) => {
    return axios.post(API_URL + "register", user);
};

export const login = (email, password) => {
    return axios
        .post(API_URL + "login", {
            email,
            password,
        })
        .then((response) => {
            const token = response.data.token
            const user = response.data.user
            delete user.password
            if (token) {
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("user", JSON.stringify(user))
            }
            return response.data;
        });
};

export const logout = async() => {
    try{
        await axios.post(API_URL + "logout", {} ,{ headers: authHeader() })
        localStorage.removeItem("token");
        localStorage.removeItem("user");

    }catch(e){
        console.log(e)
    }
};



export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"))
};
