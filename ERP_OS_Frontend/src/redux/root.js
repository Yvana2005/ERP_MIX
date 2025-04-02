import supplierReducer from "./reducers/supplierReducer";
import productReducer from "./reducers/productReducer";
import purchaseReducer from "./reducers/purchaseReducer";
import userReducer from "./reducers/userReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import customerReducer from "./reducers/customerReducer";
import saleReducer from "./reducers/saleReducer";
import supplierPaymentReducer from "./reducers/supplierPaymentReducer";
import accountReducer from "./reducers/accountReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import transactionReducer from "./reducers/transactionReducer";
import productCategoryReducer from "./reducers/productCategoryReducer";
//import designationReducer from "./reducers/designationReducer";
import logsReducer from "./reducers/auditLogsReducer";

import dashboardReducer1 from "./rtk/features/dashboard/dashboardSlice";
import designationReducer from "./rtk/features/designation/designationSlice";
import userReducer1 from "./rtk/features/user/userSlice";
import payrollSlice from "./rtk/features/payroll/payrollSlice";
import paymentSlice from "./rtk/features/payment/paymentSlice";
import shiftSlice from "./rtk/features/shift/shiftSlice";
import employmentStatusSlice from "./rtk/features/employemntStatus/employmentStatusSlice";
import attendanceReducer from "./rtk/features/attendance/attendanceSlice";
import leaveSlice from "./rtk/features/leave/leaveSlice";
import announcementSlice from "./rtk/features/announcement/announcementSlice";
import awardSlice from "./rtk/features/award/awardSlice";
import awardHistorySlice from "./rtk/features/awardHistory/awardHistorySlice";
import leavePolicySlice from "./rtk/features/leavePolicy/leavePolicySlice";
import weeklyHolidaySlice from "./rtk/features/weeklyHoliday/weeklyHolidaySlice";
import publicHolidaySlice from "./rtk/features/publicHoliday/publicHolidaySlice";
import milestoneSlice from "./rtk/features/projectManagement/project/milestone/milestone";
import projectTaskSlice from "./rtk/features/projectManagement/project/projectTask/projectTask";
import projectTeamSlice from "./rtk/features/projectManagement/project/projectTeam/projectTeam";
import taskDependencySlice from "./rtk/features/projectManagement/project/taskDependency/taskDependency";
import taskStatusSlice from "./rtk/features/projectManagement/project/taskStatus/taskStatus";
import taskTimeSlice from "./rtk/features/projectManagement/project/taskTime/taskTime";
import taskPrioritySlice from "./rtk/features/projectManagement/project/taskPriority/taskPriority";
import projectSlice from "./rtk/features/projectManagement/project/project/project";


const store = createStore(
	combineReducers({
		suppliers: supplierReducer,
		products: productReducer,
		purchases: purchaseReducer,
		customers: customerReducer,
		sales: saleReducer,
		users: userReducer,
		supplierPayments: supplierPaymentReducer,
		accounts: accountReducer,
		dashboard: dashboardReducer,
		transactions: transactionReducer,
		productCategories: productCategoryReducer,
		//designations: designationReducer,
		logs: logsReducer,

		users1: userReducer1,
		dashboard1: dashboardReducer1,
		designations: designationReducer,
		payroll: payrollSlice,
		payment: paymentSlice,
		shift: shiftSlice,
		employmentStatus: employmentStatusSlice,
		attendance: attendanceReducer,
		leave: leaveSlice,
		announcement: announcementSlice,
		award: awardSlice,
		awardHistory: awardHistorySlice,
		leavePolicy: leavePolicySlice,
		weeklyHoliday: weeklyHolidaySlice,
		publicHoliday: publicHolidaySlice,
		milestone: milestoneSlice,
		project: projectSlice,
		projectTask: projectTaskSlice,
		projectTeam: projectTeamSlice,
		taskDependency: taskDependencySlice,
		taskStatus: taskStatusSlice,
		taskTime: taskTimeSlice,
		taskPriority: taskPrioritySlice
	}),

	composeWithDevTools(applyMiddleware(thunk))
);

export default store;
