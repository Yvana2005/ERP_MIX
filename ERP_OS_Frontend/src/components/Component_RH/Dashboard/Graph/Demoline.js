import { Column } from "@ant-design/plots";
import { Card, Col, DatePicker, Row } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewDashboardCard from "../../Card/Dashboard/NewDashboardCard";
import Loader from "../../loader/loader";
import { loadDashboardData } from "../../../redux/rtk/features/dashboard/dashboardSlice";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";
import AttendancePopup from "../..//UI/PopUp/AttendancePopup";

// dayjs.extend(utc);
// //Date fucntinalities
// let startdate = dayjs(new Date()).startOf("month").format("YYYY-MM-DD");
// let enddate = dayjs(new Date()).endOf("month").format("YYYY-MM-DD");

const DemoLine = () => {
	const data = useSelector((state) => state.dashboard.list?.workHoursByDate);

	const cardInformation = useSelector((state) => state.dashboard.list);
	const [startdate, setStartdate] = useState(moment().startOf("month"));
    const [enddate, setEnddate] = useState(moment().endOf("month"));

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadDashboardData({ startdate, enddate }));
	}, []);

	const { RangePicker } = DatePicker;

	// const onCalendarChange = (dates) => {
	// 	startdate = (dates?.[0]).format("YYYY-MM-DD");
	// 	enddate = (dates?.[1]).format("YYYY-MM-DD");

	// 	dispatch(loadDashboardData({ startdate, enddate }));
	// };

	const onCalendarChange = (dates) => {
		const newStartdate = dates?.[0] ? dates[0].format("YYYY-MM-DD") : startdate;
		const newEnddate = dates?.[1] ? dates[1].format("YYYY-MM-DD") : enddate;
	
		setStartdate(newStartdate);
		setEnddate(newEnddate);

		  dispatch(
			loadDashboardData({
			  startdate: newStartdate,
			  enddate: newEnddate
			})
		  );
	
	};

	const config = {
		data,
		xField: "date",
		yField: "time",
		seriesField: "type",
		isGroup: true, // Affiche les barres côte à côte (groupées)
        columnWidthRatio: 0.2, // Largeur des barres
		yAxis: {
			label: {
				formatter: (v) => `${v / 1000} Hours`,
			},
		},
		legend: {
			position: "top",
		},
		// smooth: true,
		animation: {
			appear: {
				animation: "scale-in-y",
				duration: 5000,
			},
		},
	};

	return (
		<Fragment>
			<UserPrivateComponent permission={"readAll-dashboard"}>
				<Row gutter={[30, 30]} justify={"space-between"}>
					<Col sm={12} md={12} lg={12} span={24} className='mb-auto'>
						{/* <RangePicker
							onCalendarChange={onCalendarChange}
							defaultValue={[dayjs().startOf("month"), dayjs().endOf("month")]}
							className='range-picker'
							style={{ maxWidth: "25rem" }}
						/> */}
						
                        <RangePicker
                           onCalendarChange={onCalendarChange}
                           defaultValue={[startdate, enddate]}
                           className="range-picker"
                        />
        
					</Col>
					{/* <Col sm={24} md={24} lg={12} span={24}>
						<div className='text-end mr-4'>
							<AttendancePopup />
						</div>
					</Col> */}
				</Row>

				<NewDashboardCard information={cardInformation} />

				<Card title='HEURES DE TRAVAIL'>
					{data ? <Column {...config} /> : <Loader />}
				</Card>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default DemoLine;
