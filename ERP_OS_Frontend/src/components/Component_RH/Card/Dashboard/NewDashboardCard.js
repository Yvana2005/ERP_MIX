import React, { Fragment } from "react";
import {
	UsergroupAddOutlined,
	TeamOutlined,
	UsergroupDeleteOutlined,
	UserSwitchOutlined,
	DollarOutlined,
} from "@ant-design/icons";
import "./style.css";
import { Card, Col, Row, Statistic } from "antd";

const NewDashboardCard = ({ information }) => {
	return (
		<Fragment>
			{console.log("Dashboard data", information)}
			<section className='mt-5 mb-5'>
				<div className='site-statistic-demo-card '>
					<Row gutter={[16, 16]} justify={"space-between"}>
						<Col xs={20} sm={16} md={12} lg={4} xl={5}>
							<Card className='ant-shadow txt-color-2' bordered={false}>
								<Statistic
									title={<p className='text-xl  txt-color-2'>NOMBRES D'EMPLOYÉS</p>}
									loading={!information}
									value={information?.totalUsers}
									valueStyle={{
										color: "#10b981",
									}}
									prefix={
										<TeamOutlined
											className='mr-4'
											style={{ fontSize: "35px" }}
										/>
									}
								/>
							</Card>
						</Col>
						<Col xs={20} sm={16} md={12} lg={5} xl={5}>
							<Card className='ant-shadow txt-color-2' bordered={false}>
								<Statistic
									title={<p className='text-xl  txt-color-2'>SALAIRE TOTAL</p>}
									loading={!information}
									value={information?.totalSalary || 0}
									// precision={2}
									valueStyle={{
										color: "#4f46e5",
									}}
									prefix={
										<DollarOutlined
											className='mr-4'
											style={{ fontSize: "35px" }}
										/>
									}
								/>
							</Card>
						</Col>

						<Col xs={20} sm={16} md={12} lg={5} xl={5}>
							<Card className='ant-shadow txt-color-2' bordered={false}>
								<Statistic
									title={
										<p className='text-xl  txt-color-2'>  PRÉSENCE AUJOURD'HUI</p>
									}
									loading={!information}
									value={information?.todayPresent}
									valueStyle={{
										color: "#0891b2",
									}}
									prefix={
										<UsergroupAddOutlined
											className='mr-4'
											style={{ fontSize: "35px" }}
										/>
									}
								/>
							</Card>
						</Col>
						<Col xs={20} sm={16} md={12} lg={5} xl={5}>
							<Card className='ant-shadow txt-color-2' bordered={false}>
								<Statistic
									title={<p className='text-xl  txt-color-2'>CONGÉ D'AUJOURD'HUI </p>}
									loading={!information}
									value={information?.todayOnLeave}
									valueStyle={{
										color: "#a855f7",
									}}
									prefix={
										<UserSwitchOutlined
											className='mr-4'
											style={{ fontSize: "35px" }}
										/>
									}
								/>
							</Card>
						</Col>
						<Col xs={20} sm={16} md={12} lg={4} xl={4}>
							<Card className='ant-shadow txt-color-2' bordered={false}>
								<Statistic
									title={<p className='text-xl  txt-color-2'> ABSENCE DU JOUR</p>}
									loading={!information}
									value={information?.todayAbsent}
									valueStyle={{
										color: "#f43f5e",
									}}
									prefix={
										<UsergroupDeleteOutlined
											className='mr-4'
											style={{ fontSize: "35px" }}
										/>
									}
								/>
							</Card>
						</Col>
					</Row>
				</div>
			</section>
		</Fragment>
	);
};

export default NewDashboardCard;
