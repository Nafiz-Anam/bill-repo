import axios from "axios";
import { API_BASE_URL } from "../../../apiconstants";

// Register user
const getBills = async (token) => {
    // console.log("token =>", token);
    const config = {
        headers: {
            token: `Bearer ${token}`,
        },
    };
    const response = await axios(API_BASE_URL + "/api/billing-list/", config);
    // console.log("response", response.data);
    return response.data.result;
};

const billServices = {
    getBills,
};

export default billServices;
