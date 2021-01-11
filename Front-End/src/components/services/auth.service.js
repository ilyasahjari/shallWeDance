import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3001/api/user/";

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
            if (token) {
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("user", JSON.stringify(user))
            }
            return response.data;
        });
};

export const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

};



export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"))
};