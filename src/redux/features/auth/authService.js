import axios from "axios";
import { API_BASE_URL } from "../../../apiconstants";

// Register user
const registration = async (userData) => {
    // console.log("userData", userData);
    const response = await axios.post(
        API_BASE_URL + "/api/registration",
        userData
    );
    // console.log("response", response);
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_BASE_URL + "/api/login", userData);
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    registration,
    logout,
    login,
};

export default authService;
