import React, { useEffect, useState } from "react";
import ViewBtn from "../Buttons/ViewBtn";
import dayjs from "dayjs";
import { Card, Table, Tag } from "antd";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import PageTitle from "../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
	loadAttendanceByUserId,
	clearAttendanceList,
} from "../../redux/rtk/features/attendance/attendanceSlice";

import { useParams } from "react-router-dom";
import Loader from "../loader/loader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

function CustomTable({ list, loading }) {
	const [columnsToShow, setColumnsToShow] = useState([]);

	const columns = [
		{
			id: 1,
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			id: 2,
			title: "Nom",
			dataIndex: "user",
			key: "user",
			render: ({ firstName, lastName }) => firstName + " " + lastName,
		},

		{
			id: 3,
			title: "heure d'arrivée",
			dataIndex: "inTime",
			key: "inTime",
			render: (inTime) => dayjs(inTime).format("DD-MM-YYYY, HH:mm"),
		},

		{
			id: 4,
			title: "Heure de depart",
			dataIndex: "outTime",
			key: "outTime",
			render: (outTime) => dayjs(outTime).format("DD-MM-YYYY, HH:mm"),
		},
		{
			id: 4,
			title: "Statut à l'arrivée",
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
			title: "Statut au depart",
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
			id: 7,
			title: "Enregistré par",
			dataIndex: "punchBy",
			key: "punchBy",
			render: (punchBy) => (
				<span>
					{punchBy[0]?.firstName + " " + punchBy[0]?.lastName || "Not Checked"}
				</span>
			),
		},
		{
			id: 6,
			title: "Heure Total",
			dataIndex: "totalHour",
			key: "totalHour",
			render: (totalHour) => totalHour || "Not Checked",
		},

		// {
		// 	id: 8,
		// 	title: "Action",
		// 	dataIndex: "id",
		// 	key: "id",
		// 	render: (id) => (
		// 		<UserPrivateComponent permission={"readSingle-user"}>
					
		// 			<ViewBtn path={`/admin/attendance/${id}`} />
		// 		</UserPrivateComponent>
		// 	),
		// },
	];

	useEffect(() => {
		setColumnsToShow(columns);
	}, []);

	const columnsToShowHandler = (val) => {
		setColumnsToShow(val);
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<Card className='mt-5'>
			<div className='text-center my-2 flex justify-between'>
				<h5 className='department-list-title text-color-2 text-xl mb-2'>
				Historique des présences
				</h5>
				{list && (
					<div>
						<CsvLinkBtn>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm mb-1'
								filename='attendance_user'>
								Télécharger CSV
							</CSVLink>
						</CsvLinkBtn>
					</div>
				)}
			</div>

			{list && (
				<div style={{ marginBottom: "30px" }}>
					<ColVisibilityDropdown
						options={columns}
						columns={columns}
						columnsToShowHandler={columnsToShowHandler}
					/>
				</div>
			)}

			<Table
				scroll={{ x: true }}
				loading={loading}
				columns={columnsToShow}
				dataSource={list ? addKeys(list) : []}
			/>
		</Card>
	);
}

const UserAttendance = () => {
	const { list, loading } = useSelector((state) => state.attendance);
	const { id } = useParams("id");

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAttendanceByUserId(id));

		return () => {
			dispatch(clearAttendanceList());
		};
	}, [id]);

	return (
		<UserPrivateComponent permission='readSingle-attendance'>
			<div>
				<PageTitle title='Retour' />
				{!loading ? <CustomTable list={list} loading={loading} /> : <Loader />}
			</div>
		</UserPrivateComponent>
	);
};

export default UserAttendance;
