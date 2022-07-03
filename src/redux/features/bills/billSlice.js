import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import billServices from "./billServices";

// const user = JSON.parse(localStorage.getItem("user"));
// console.log(user);

const initialState = {
    bills: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    total: 0,
};

// Get user bills
export const getBills = createAsyncThunk(
    "/billing-list",
    async (_, thunkAPI) => {
        const tokenData = thunkAPI.getState().auth.user.accessToken;
        try {
            // const token = user.accessToken;
            // console.log("init token => ", token);
            return await billServices.getBills(tokenData);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const billSlice = createSlice({
    name: "bills",
    initialState,
    reducers: {
        calculateTotal: (state) => {
            let total = 0;
            state.bills.forEach((bill) => {
                total += bill.paid_amount;
            });
            state.total = total;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBills.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBills.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bills = action.payload;
            })
            .addCase(getBills.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { calculateTotal } = billSlice.actions;
export default billSlice.reducer;
