import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";

import { Card, DatePicker, Segmented, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";

import { CsvLinkBtn, TableHeraderh2 } from "../UI/CsvLinkBtn";
import {
	loadAllAttendancePaginated,
	clearAttendanceList,
} from "../../redux/rtk/features/attendance/attendanceSlice";
import BtnSearchSvg from "../UI/Button/btnSearchSvg";
import { VioletLinkBtn } from "../UI/AllLinkBtn";
import AttendancePrint from "./AttendancePrint";
import moment from "moment";


//Date fucntinalities
// let startdate = dayjs().startOf("month");
// let enddate = dayjs().endOf("month");


function CustomTable({ list, total, status, setStatus, loading }) {

	const [columnsToShow, setColumnsToShow] = useState([]);

	const dispatch = useDispatch();
	const [startdate, setStartdate] = useState(moment().startOf("month"));
    const [enddate, setEnddate] = useState(moment().endOf("month"));

	const onChange = (value) => {
		setStatus(value);
		dispatch(
			loadAllAttendancePaginated({
				page: 1,
				limit: 30,
				startdate,
				enddate,
			})
		);
	};

	const columns = [
		{
			id: 1,
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			id: 10,
			title: "Nom",
			dataIndex: "user",
			key: "user",
			render: (user) => `${user?.firstName} ${user?.lastName}`,
		},
		{
			id: 2,
			title:"Heure d'arrivée",
			dataIndex: "inTime",
			key: "inTime",
			render: (inTime) => dayjs(inTime).format("DD-MM-YYYY, HH:mm") || "NONE",
		},
		{
			id: 3,
			title: "Heure de depart",
			dataIndex: "outTime",
			key: "outTime",
			render: (outTime) =>
				dayjs(outTime).format("DD-MM-YYYY, HH:mm") || "NONE",
		},
		{
			id: 4,
			title: "statut d'arrivée",
			dataIndex: "inTimeStatus",
			key: "inTimeStatus",
			render: (inTimeStatus) => {
				// use Tag component from antd to show status in different colors like green, red, yellow etc based on the status value
				if (inTimeStatus === "En retard") {
					return <Tag color='red'>{inTimeStatus.toUpperCase()}</Tag>;
				} else if (inTimeStatus === "En avance") {
					return <Tag color='blue'>{inTimeStatus.toUpperCase()}</Tag>;
				} else if (inTimeStatus === "A l'heure") {
					return <Tag color='green'>{inTimeStatus.toUpperCase()}</Tag>;
				} else {
					return <Tag style={{ color: "orange" }}>AUCUN</Tag>;
				}
			},
		},
		{
			id: 5,
			title: "Statut de départ",
			dataIndex: "outTimeStatus",
			key: "outTimeStatus",
			render: (outTimeStatus) => {
				// use Tag component from antd to show status in different colors like green, red, yellow etc based on the status value
				if (outTimeStatus === "En retard") {
					return <Tag color='red'>{outTimeStatus.toUpperCase()}</Tag>;
				} else if (outTimeStatus === "En avance") {
					return <Tag color='blue'>{outTimeStatus.toUpperCase()}</Tag>;
				} else if (outTimeStatus === "A l'heure") {
					return <Tag color='green'>{outTimeStatus.toUpperCase()}</Tag>;
				} else {
					return <Tag style={{ color: "orange" }}>AUCUN</Tag>;
				}
			},
		},
		{
			id: 6,
			title: "Heure Total",
			dataIndex: "totalHour",
			key: "totalHour",
			render: (totalHour) => totalHour || "Not Checked",
		},

		{
			id: 7,
			title: "Enregistré Par",
			dataIndex: "punchBy",
			key: "punchBy",
			render: (punchBy) => (
				<span>
					{punchBy[0]?.firstName + " " + punchBy[0]?.lastName || "Not Checked"}
				</span>
			),
		},

		
	];

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	const CSVlist = list?.map((i) => ({
		...i,
		supplier: i?.supplier?.name,
	}));

	const logs = list?.map((i) => ({
		...i,
		supplier: i?.supplier?.name,
	}));

	return (
		<div className='mt-5'>
			{list && (
				<div className='text-center my-2 flex justify-end'>
					<CsvLinkBtn>
						<CSVLink data={CSVlist} filename='purchase'>
						Télécharger CSV
						</CSVLink>
					</CsvLinkBtn>

					
				</div>
			)}

			{list && (
				<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					/>
					<AttendancePrint data={logs} />
				</div>
			)}

			<Table
			    
				scroll={{ x: true }}
				loading={loading}
				pagination={{
					defaultPageSize: 30,
					pageSizeOptions: [30, 40, 50, 100, 200],
					showSizeChanger: true,
					total: total ? total : 100,

					onChange: (page, limit) => {
						dispatch(
							loadAllAttendancePaginated({ page, limit, startdate, enddate })
						);
					},
				}}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllAttendance = (props) => {

	
	const dispatch = useDispatch();
    const [count, setCount] = useState(10);
	const { list, loading } = useSelector((state) => state.attendance);
	
	
	const [status, setStatus] = useState("true");
	const [startdate, setStartdate] = useState(moment().startOf("month"));
    const [enddate, setEnddate] = useState(moment().endOf("month"));

	// const [total, setTotal] = useState(0);

	const { RangePicker } = DatePicker;

	useEffect(() => {
		dispatch(
			loadAllAttendancePaginated({
				page: 1,
				limit: 30,
				startdate: startdate,
				enddate: enddate
			})
		);
	}, [dispatch, startdate, enddate]);

	const onCalendarChange = (dates) => {
		if (dates && dates[0] && dates[1]) {
			const newStartDate = dates[0].format("YYYY-MM-DDTHH:mm:ss");
			const newEndDate = dates[1].format("YYYY-MM-DDTHH:mm:ss");
			setStartdate(newStartDate);
			setEnddate(newEndDate);
		  } else {
			console.error("Les dates sélectionnées sont nulles ou non définies.");
		  }
	};

	const onClickSearch = () => {
		// dispatch(clearAttendanceList());

		if (!startdate || !enddate) {
			console.error("Les dates ne sont pas définies correctement !");
			return;
		  }
		  dispatch(
			loadAllAttendancePaginated({
			  page: 1,
			  limit: 30,
			  startdate: startdate.format("YYYY-MM-DD"),
			  enddate: enddate.format("YYYY-MM-DD"),
			})
		  );
	};
	

	// TODO : Add Search functionality here

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	return (
		<>
			<Card className='card card-custom mt-3 '>
				<div className='card-body'>
					<div className='flex justify-between'>
						<TableHeraderh2>Liste de présence</TableHeraderh2>
						<div className='flex justify-end'>
							<RangePicker
								onCalendarChange={onCalendarChange}
								defaultValue={[startdate, enddate]}
								// defaultValue={[
								// 	moment().startOf("month"),
								// 	moment().endOf("month")
								//   ]}
								// format={"DD-MM-YYYY"}
								className='range-picker mr-3'
								style={{ maxWidth: "400px" }}
							/>
							<VioletLinkBtn>
								<button onClick={onClickSearch}>
									<BtnSearchSvg size={25} title={"SEARCH"} loading={loading} />
								</button>
							</VioletLinkBtn>
							
						</div>
						{/* <div className="text-end">
                            
                        </div> */}
					
					</div>
					{/*TODO : ADD TOTAL AMOUNT HERE */}
					<CustomTable
						list={list}
						loading={loading}
						total={100}
						startdate={startdate}
						enddate={enddate}
						status={status}
						setStatus={setStatus}
					/>
				</div>
			</Card>
		</>
	);
};

export default GetAllAttendance;
