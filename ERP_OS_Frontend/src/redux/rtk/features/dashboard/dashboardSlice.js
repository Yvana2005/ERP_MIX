import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	list: [],
	error: "",
	loading: false,
};

export const loadDashboardData = createAsyncThunk(
	"dashboard/loadDashboardData",
	async ({ startdate, enddate }) => {
		try {
			
			const { data } = await axios.get(
			  `dashboardRH?startdate=${startdate}&enddate=${enddate}`
			);
			return data;
		  } catch (error) {
			console.log("Dashboard load error:", error.response?.data || error.message); // 🐛
		  }
	}
);

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	extraReducers: (builder) => {
		// 1) ====== builders for loadDashboardData ======

		builder.addCase(loadDashboardData.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadDashboardData.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(loadDashboardData.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default dashboardSlice.reducer;
