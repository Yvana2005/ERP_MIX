import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import DetailsSup from "./components/Component_SMS/suppliers/detailsSup";
import Suppliers from "./components/Component_SMS/suppliers/suppliers";
import UpdateSup from "./components/Component_SMS/suppliers/updateSup";

import DetailsProd from "./components/Component_SMS/product/detailsProd";
import Product from "./components/Component_SMS/product/product";
import UpdateProd from "./components/Component_SMS/product/updateProd";
import GetAllProd from "./components/Component_SMS/product/getAllProd";

import ProductMat from "./components/Component_SMS/produitMatièrePremière/productMat";
import GetAllProdMat from "./components/Component_SMS/produitMatièrePremière/getAllProdMat";
import DetailsProdMat from "./components/Component_SMS/produitMatièrePremière/detailsProdMat";

import DetailsPurch from "./components/Component_SMS/purchase/detailsPurch";
import Purchase from "./components/Component_SMS/purchase/purchase";

import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import UserList from "./components/user/user";
import DetailStaff from "./components/user/detailsStaff";
import GetAllUsers from "./components/user/GetAllUser";

import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Customer from "./components/Component_SMS/customer/customer";
import DetailCust from "./components/Component_SMS/customer/detailCust";
import UpdateCust from "./components/Component_SMS/customer/updateCust";
import Pos from "./components/Component_SMS/pos/pos";
import DetailSale from "./components/Component_SMS/sale/detailSale";
import Sale from "./components/Component_SMS/sale/sale";

import Page404 from "./components/404/404Page";
import Dashboard from "./components/Global_Dashboard/Graph/Dashboard";
import DashboardSMS from "./components/Component_SMS/Dashboard/Graph/Dashboard";
import DashboardRH from "./components/Component_RH/Dashboard/Graph/Dashboard";
import AddCustPaymentByInvoice from "./components/Component_SMS/Payment/CustomerPaymentByInvoice";
import AddSupPaymentByInvoice from "./components/Component_SMS/Payment/SupplierPaymentByInvoice";
import GetAllPurch from "./components/Component_SMS/purchase/getAllPurch";
import GetAllSale from "./components/Component_SMS/sale/getAllSale";
//import DetailStaff from "./components/Component_SMS/user/detailsStaff";
//import UpdateStaff from "./components/Component_SMS/user/updateStaff";

// import Register from "./components/user/Register";
import { Layout } from "antd";
import Account from "./components/account/account";
import BalanceSheet from "./components/account/balanceSheet";
import DetailAccount from "./components/account/detailAccount";
import IncomeStatement from "./components/account/incomeStatement";
import TrialBalance from "./components/account/trialBalance";
// import Designation from "./components/designation/designation";
// import DetailDesignation from "./components/designation/detailDesignation";
// import UpdateDesignation from "./components/designation/updateDesignation";
import Main from "./components/layouts/Main";
import DetailProductCategory from "./components/Component_SMS/productCategory/detailProductCategory";
import ProductCategory from "./components/Component_SMS/productCategory/productCategory";
import UpdateProductCategory from "./components/Component_SMS/productCategory/updateProductCategory";
import AddReturnPurchase from "./components/Component_SMS/purchase/addReturnPurchase";
import AddPermission from "./components/role/AddPermission";
import DetailRole from "./components/role/DetailsRole";
import RoleList from "./components/role/role";
import AddReturnSale from "./components/Component_SMS/sale/addReturnSale";
import InvoiceSetting from "./components/settings/invoiceSetting";
import AddTransaction from "./components/Component_SMS/transaction/AddTransaction";
import DetailTransaction from "./components/Component_SMS/transaction/detailTransaction";
import Transaction from "./components/Component_SMS/transaction/transaction";
import Register from "./components/Component_SMS/customer/Register";
import SaleMat from "./components/Component_SMS/saleMat/saleMat";
import GetAllSaleMat from "./components/Component_SMS/saleMat/getAllSaleMat";
import DetailSaleMat from "./components/Component_SMS/saleMat/detailSaleMat";
import GetAllAudiLogs from "./components/AuditLog/getAllAuditLogs";
import ResetPassword from "./components/Component_SMS/customer/ResetPassword";
import ForgotPassword from "./components/Component_SMS/customer/ForgotPassword";
//import { PaymentProvider } from "./context/PaymentContext";
import Designation from "./components/Component_RH/designation/designation";
import DetailDesignation from "./components/Component_RH/designation/detailDesignation";
import UpdateDesignation from "./components/Component_RH/designation/updateDesignation";

import Department from "./components/Component_RH/department/Department.js";
import DetailDepartment from "./components/Component_RH/department/DetailsDepartment";

import CalculatePayroll from "./components/Component_RH/payroll/CalculatePayroll";
import PayslipList from "./components/Component_RH/payroll/PayslipList";
import DetailPayslip from "./components/Component_RH/payroll/PayslipDetail";

import Shift from "./components/Component_RH/shift/Shift";
import DetailShift from "./components/Component_RH/shift/ShiftDetails";

import EmploymentStatus from "./components/Component_RH/employmentStatus/EmploymentStatus";
import DetailEmploymentStatus from "./components/Component_RH/employmentStatus/EmploymentStatusDetails";

import Attendance from "./components/Component_RH/attendance/AddAttendance";
import DetailAttendance from "./components/Component_RH/attendance/DetailAttendance";
import UserAttendance from "./components/Component_RH/attendance/UserAttendance";

import Leave from "./components/Component_RH/leave/Leave";
import GetAllLeaves from "./components/Component_RH/leave/GetAllLeaves";
import DetailLeave from "./components/Component_RH/leave/DetailLeave";
import UserLeave from "./components/Component_RH/leave/UserLeave";
import UpdateLeave from "./components/Component_RH/leave/UpdateLeave";

import Announcement from "./components/Component_RH/announcement/Announcement";
import DetailAnnouncement from "./components/Component_RH/announcement/AnnouncementDetails";

import LeavePolicy from "./components/Component_RH/leavePolicy/LeavePolicy";
import DetailLeavePolicy from "./components/Component_RH/leavePolicy/DetailsLeavePolicy";

import Award from "./components/Component_RH/award/Award";
import DetailAward from "./components/Component_RH/award/DetailsAward";
import AddAward from "./components/Component_RH/award/AddAward";
import GetAllAward from "./components/Component_RH/award/GetAllAward";

import WeeklyHoliday from "./components/Component_RH/weeklyHoliday/WeeklyHoliday";
import DetailWeeklyHoliday from "./components/Component_RH/weeklyHoliday/DetailsWeeklyHoliday";

import PublicHoliday from "./components/Component_RH/publicHoliday/PublicHoliday";
import DetailPublicHoliday from "./components/Component_RH/publicHoliday/DetailsPublicHoliday";

import UserPrivateRoute from "./components/Component_RH/PrivateRoutes/UserPrivateRoute";

import Project from "./components/Component_RH/project/project";
import AddProject from "./components/Component_RH/project/AddProject";
import UpdateProject from "./components/Component_RH/project/UpdateProject";

import Milestone from "./components/Component_RH/project/milestone/milestone";
import UpdateMilestone from "./components/Component_RH/project/milestone/UpdateMilestone";

import TaskStatus from "./components/Component_RH/project/taskStatus/taskStatus";
import UpdateTaskStatus from "./components/Component_RH/project/taskStatus/UpdateTaskStatus";

import TaskPriority from "./components/Component_RH/project/taskPriority/taskPriority";
import UpdateTaskPriority from "./components/Component_RH/project/taskPriority/UpdateTaskPriority";

import DetailProjectTeam from "./components/Component_RH/project/team/DetailProjectTeam";
import ProjectTeam from "./components/Component_RH/project/team/ProjectTeam";

import Task from "./components/Component_RH/project/tasks/tasks";

import UpdateStatus from "./components/Component_RH/project/UpdateStatus";
import KanbanBoard2 from "./components/Component_RH/kanbanBoard/KanbanBoard2";

import { ModuleProvider } from './components/layouts/ModuleContext';



const { Sider } = Layout;

function App() {
  return (
    <div className="App container-fluid">
      <BrowserRouter>
      <ModuleProvider>
        <Main>
          <ToastContainer />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/dashboardsms" element={<DashboardSMS />}></Route>
            <Route path="/admin/dashboardrh" element={<DashboardRH />}></Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />

            <Route path="/supplier" exact element={<Suppliers />} />
            <Route path="/supplier/:id" element={<DetailsSup />} />
            <Route path="/supplier/:id/update" element={<UpdateSup />} />

            <Route path="/product" exact element={<Product />} />
            <Route path="/product/:id" element={<DetailsProd />} />
            <Route path="/product/:id/update" element={<UpdateProd />} />
            <Route path="/productlist" exact element={<GetAllProd />} />

            <Route path="/productMat" exact element={<ProductMat />} />
            <Route path="/productMatlist" exact element={<GetAllProdMat />} />
            <Route path="/productMat/:id" element={<DetailsProdMat />} />
            {/* <Route path="/salemat" exact element={<Mat />} /> */}

            <Route
              path="/product-category"
              exact
              element={<ProductCategory />}
            />
            <Route
              path="/product-category/:id"
              element={<DetailProductCategory />}
            />
            <Route
              path="/product-category/:id/update"
              element={<UpdateProductCategory />}
            />

            <Route path="/purchase" exact element={<Purchase />} />
            <Route path="/purchaselist" exact element={<GetAllPurch />} />
            <Route path="/purchase/:id" element={<DetailsPurch />} />
            <Route
              path="/purchase/return/:id"
              element={<AddReturnPurchase />}
            />

            <Route path="/customer" exact element={<Customer />} />
            <Route path="/customer/:id" element={<DetailCust />} />
            <Route path="/customer/:id/update" element={<UpdateCust />} />

            <Route path="/sale" exact element={<Sale />} />
            <Route path="/salelist" exact element={<GetAllSale />} />
            <Route path="/sale/:id" element={<DetailSale />} />

            <Route path="/stockproductMatlist" exact element={<SaleMat />} />
            <Route path="/saleMatList" exact element={<GetAllSaleMat />} />
            <Route path="/saleMat/:id" exact element={<DetailSaleMat />} />

            <Route path="/sale/:id/update" element={<UpdateProd />} />
            <Route path="/sale/return/:id" element={<AddReturnSale />} />
            <Route
              path="/payment/supplier/:pid"
              exact
              element={<AddSupPaymentByInvoice />}
            />
            <Route
              path="/payment/customer/:pid"
              exact
              element={<AddCustPaymentByInvoice />}
            />
            <Route path="/transaction" exact element={<Transaction />} />
            <Route
              path="/transaction/create"
              exact
              element={<AddTransaction />}
            />
            <Route path="/transaction/:id" element={<DetailTransaction />} />

            <Route path="/auth/login" exact element={<Login />} />
            <Route path="/auth/logout" exact element={<Logout />} />
            {/*         <Route path='/auth/register' exact element={<Register />} /> */}
            <Route path="/register" exact element={<Register />} />
            {/* <Route path="/hr/staffs" exact element={<UserList />} />
            <Route path="/hr/staffs/:id" exact element={<DetailStaff />} />
            <Route path="/hr/staffs/:id/update" element={<UpdateStaff />} /> */}
            <Route element={<UserPrivateRoute permission={"updateUser"} />}>
							<Route path='/admin/hr/staffs/new' exact element={<UserList />} />
						</Route>
						<Route element={<UserPrivateRoute permission={"viewUser"} />}>
							<Route path='/admin/hr/staffs' exact element={<GetAllUsers />} />
						</Route>
						<Route
							element={<UserPrivateRoute permission={"viewUser"} />}>
							<Route
								path='/admin/hr/staffs/:id'
								exact
								element={<DetailStaff />}
							/>
						</Route>

            <Route path="/role" exact element={<RoleList />} />
            <Route path="/role/:id" element={<DetailRole />} />
            <Route path="/role/permit/:id/" element={<AddPermission />} />

            <Route path="/account" exact element={<Account />} />
            <Route path="/account/:id" element={<DetailAccount />} />
            <Route
              path="/account/trial-balance"
              exact
              element={<TrialBalance />}
            />
            <Route
              path="/account/balance-sheet"
              exact
              element={<BalanceSheet />}
            />
            <Route path="/account/income" exact element={<IncomeStatement />} />
            {/* <Route path="/designation" exact element={<Designation />} />
            <Route path="/designation/:id" element={<DetailDesignation />} />
            <Route
              path="/designation/:id/update"
              element={<UpdateDesignation />}
            /> */}

            <Route path="/pos" exact element={<Pos />} />

            <Route path="/invoice-setting" exact element={<InvoiceSetting />} />
            <Route path="/allAuditLogs" exact element={<GetAllAudiLogs />} />

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
							element={<UserPrivateRoute permission={"viewDesignation"} />}>
							<Route
								path='/admin/designation'
								exact
								element={<Designation />}
							/>
						</Route>

						<Route
							element={
								<UserPrivateRoute permission={"viewDesignation"} />
							}>
							<Route
								path='/admin/designation/:id'
								element={<DetailDesignation />}
							/>
						</Route>
						<Route
							element={<UserPrivateRoute permission={"updateDesignation"} />}>
							<Route
								path='/admin/designation/:id/update'
								element={<UpdateDesignation />}
							/>
						</Route>

            <Route
							element={<UserPrivateRoute permission={"readAll-department"} />}>
							<Route path='/admin/department' exact element={<Department />} />
						</Route>
						<Route
							element={
								<UserPrivateRoute permission={"readSingle-department"} />
							}>
							<Route
								path='/admin/department/:id'
								element={<DetailDepartment />}
							/>
						</Route>


						{/* === === === Payroll Routes === === === */}
						<Route
							element={<UserPrivateRoute permission={"readAll-payroll"} />}>
							<Route path='/admin/payroll/new' element={<CalculatePayroll />} />
							<Route path='/admin/payroll/list' element={<PayslipList />} />
						</Route>
						<Route
							element={<UserPrivateRoute permission={"readSingle-payroll"} />}>
							<Route path='/admin/payroll/:id' element={<DetailPayslip />} />
						</Route>

						{/* === === === Shift Routes === === === */}

						<Route element={<UserPrivateRoute permission={"readAll-shift"} />}>
							<Route path='/admin/shift' element={<Shift />} />
						</Route>

						<Route
							element={<UserPrivateRoute permission={"readSingle-shift"} />}>
							<Route path='/admin/shift/:id' element={<DetailShift />} />
						</Route>

						{/* === === === EmploymentStatus Routes === === === */}
						<Route
							element={
								<UserPrivateRoute permission={"readAll-employmentStatus"} />
							}>
							<Route
								path='/admin/employment-status'
								element={<EmploymentStatus />}
							/>
						</Route>

						<Route
							element={
								<UserPrivateRoute permission={"readSingle-employmentStatus"} />
							}>
							<Route
								path='/admin/employment-status/:id'
								element={<DetailEmploymentStatus />}
							/>
						</Route>

						{/* === === === Leave Routes === === === */}

						<Route
							element={
								<UserPrivateRoute permission={"create-leaveApplication"} />
							}>
							<Route path='/admin/leave/new' element={<Leave />} />
						</Route>
						<Route
							element={
								<UserPrivateRoute permission={"readAll-leaveApplication"} />
							}>
							
							<Route path='/admin/leave' element={<GetAllLeaves />} />
						</Route>
						<Route
							element={
								<UserPrivateRoute permission={"readSingle-leaveApplication"} />
							}>
							<Route path='/admin/leave/:id' element={<DetailLeave />} />
							<Route path='/admin/leave/user/:id' element={<UserLeave />} />
						</Route>
						<Route
							element={<UserPrivateRoute permission={"update-leaveApplication"} />
							}>
							<Route
								path='/admin/leave/:id/update'
								element={<UpdateLeave />}
							/>
						</Route>
						{/* === === === Attendance Routes === === === */}
						<Route
							element={<UserPrivateRoute permission={"readAll-attendance"} />}>
							<Route path='/admin/attendance' element={<Attendance />} />
						</Route>

						<Route
							element={
								<UserPrivateRoute permission={"readSingle-attendance"} />
							}>
							<Route
								path='/admin/attendance/user/:id'
								element={<UserAttendance />}
							/>
						</Route>

            {/* === === === Announcement Routes === === === */}
						<Route
							element={
								<UserPrivateRoute permission={"readAll-announcement"} />
							}>
							<Route
								path='/admin/announcement'
								exact
								element={<Announcement />}
							/>
						</Route>

						<Route
							element={
								<UserPrivateRoute permission={"readSingle-announcement"} />
							}>
							<Route
								path='/admin/announcement/:id'
								element={<DetailAnnouncement />}
							/>
						</Route>

						{/* === === === Award Routes === === === */}

						<Route element={<UserPrivateRoute permission={"create-award"} />}>
							<Route path='/admin/award/new' exact element={<AddAward />} />
						</Route>
						<Route element={<UserPrivateRoute permission={"readAll-award"} />}>
							<Route path='/admin/award/:id' element={<DetailAward />} />
							<Route path='/admin/award' exact element={<GetAllAward />} />
						</Route>

						{/* === === === Leave Policy Routes === === === */}
						<Route
							element={<UserPrivateRoute permission={"readAll-leavePolicy"} />}>
							<Route
								path='/admin/leave-policy'
								exact
								element={<LeavePolicy />}
							/>
							<Route
								path='/admin/leave-policy/:id'
								element={<DetailLeavePolicy />}
							/>
						</Route>

						{/* === === === Weekly Holiday Routes === === === */}
						<Route
							element={
								<UserPrivateRoute permission={"readAll-weeklyHoliday"} />
							}>
							<Route
								path='/admin/holiday/week'
								exact
								element={<WeeklyHoliday />}
							/>
							<Route
								path='/admin/holiday/week/:id'
								element={<DetailWeeklyHoliday />}
							/>
						</Route>
						{/* === === === Public Holiday Routes === === === */}
						<Route
							element={
								<UserPrivateRoute permission={"readAll-publicHoliday"} />
							}>
							<Route
								path='/admin/holiday/public'
								exact
								element={<PublicHoliday />}
							/>
							<Route
								path='/admin/holiday/public/:id'
								element={<DetailPublicHoliday />}
							/>
						</Route>

						{/* === === === === PROJECT MANAGEMENT STARTED HERE === === === ===*/}

						{/* === === === Kanban Routes === === === */}
						<Route
							element={<UserPrivateRoute permission={"readSingle-project"} />}>
							<Route
								path='/admin/kanban/:projectId'
								element={<KanbanBoard2 />}
							/>
						</Route>
						{/* <Route
							path='/admin/kanban2/:projectId'
							element={<KanbanBoard2 />}
						/>
 */}
						{/* === === === Project Routes === === === */}
						<Route
							element={<UserPrivateRoute permission={"readAll-project"} />}>
							<Route path='/admin/project' element={<Project />} />
						</Route>

						<Route element={<UserPrivateRoute permission={"create-project"} />}>
							<Route path='/admin/project/new' element={<AddProject />} />
						</Route>

						<Route element={<UserPrivateRoute permission={"update-project"} />}>
							<Route
								path='/admin/project/update/:projectId'
								element={<UpdateProject />}
							/>
						</Route>

						<Route
							path='/admin/project/update/:projectId/status'
							element={<UpdateStatus />}
						/>

						{/* === === === Project Milestone === === === */}

						<Route
							element={<UserPrivateRoute permission={"readAll-project"} />}>
							<Route
								path='/admin/project/:id/milestone'
								element={<Milestone isFixed={true} />}
							/>
						</Route>

						{/* === === === Project Task Status === === === */}

						<Route
							element={<UserPrivateRoute permission={"readAll-project"} />}>
							<Route
								path='/admin/project/:id/task-status'
								element={<TaskStatus isFixed={true} />}
							/>
						</Route>

						{/* === === === Team Routes === === === */}

						<Route
							element={<UserPrivateRoute permission={"readAll-projectTeam"} />}>
							<Route path='/admin/team' element={<ProjectTeam />} />
						</Route>

						<Route
							element={
								<UserPrivateRoute permission={"readSingle-projectTeam"} />
							}>
							<Route path='/admin/team/:id' element={<DetailProjectTeam />} />
						</Route>
						{/* <Route path='/admin/team/update/:id' element={<DetailProjectTeam />} /> */}

						{/* === === === Milestone Routes === === === */}

						<Route
							element={<UserPrivateRoute permission={"create-milestone"} />}>
							<Route path='/admin/milestone' element={<Milestone />} />
						</Route>

						<Route
							element={<UserPrivateRoute permission={"update-milestone"} />}>
							<Route
								path='/admin/milestone/update/:id'
								element={<UpdateMilestone />}
							/>
						</Route>

						{/* <Route path="/admin/milestone/:id" element={<DetailProject />} /> */}

						<Route element={<UserPrivateRoute permission={"create-task"} />}>
							<Route path='/admin/task' element={<Task />} />
						</Route>

						{/* === === === TaskStatus Routes === === === */}

						<Route
							element={<UserPrivateRoute permission={"readAll-taskStatus"} />}>
							<Route path='/admin/task-status' element={<TaskStatus />} />
						</Route>

						<Route
							element={<UserPrivateRoute permission={"update-taskStatus"} />}>
							<Route
								path='/admin/task-status/update/:id'
								element={<UpdateTaskStatus />}
							/>
						</Route>

						{/* === === === TaskPriority Routes === === === */}

						<Route
							element={<UserPrivateRoute permission={"readAll-priority"} />}>
							<Route path='/admin/task-priority' element={<TaskPriority />} />
						</Route>

						<Route
							element={<UserPrivateRoute permission={"update-priority"} />}>
							<Route
								path='/admin/task-priority/update/:id'
								element={<UpdateTaskPriority />}
							/>
						</Route>

          </Routes>
        </Main>
      </ModuleProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
