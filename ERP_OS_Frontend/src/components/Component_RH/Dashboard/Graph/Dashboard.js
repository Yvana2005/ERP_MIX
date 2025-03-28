import { Card, Col, Row } from "antd";
import React from "react";
import { Navigate } from "react-router-dom";
import checkTokenExp from "../../../utils/checkTokenExp";

import PublicHolidayBar from "./PublicHolidayBar";
import DemoLine from "./Demoline";
import AnnouncementBar from "./AnnouncementBar";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";
import AttendancePopup from "../..//UI/PopUp/AttendancePopup";

const Dashboard = () => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}

	//Looging Out if token is expried

	const accessToken = localStorage.getItem("access-token");
	checkTokenExp(accessToken);
	return (
		<>
		   <UserPrivateComponent permission={"readAll-announcement"}>
			<div>
				<div>
				<div>
              <Row>
                   <Col span={12} offset={0} className="mb-4"> {/* span réduit pour le déplacer */}
                           <div className='text-start mr-4'> {/* text-align à gauche */}
                             <AttendancePopup />
                           </div>
                   </Col>
               </Row>
                 </div>
					<div className='mb-3'>
						<Row>
							<Col span={24}>
								<DemoLine />
							</Col>
						</Row>
					</div>
					<div>
						<Row gutter={[30, 30]}>
							<Col sm={24} md={24} lg={12} span={24} className='mb-auto'>
								<Card title="JOURS FÉRIÉS DE L'ANNÉE" className=''>
									<PublicHolidayBar />
								</Card>
							</Col>
							<Col sm={24} md={24} lg={12} span={24}>
								<Card title='ANNONCES'>
									<AnnouncementBar />
								</Card>
							</Col>
						</Row>
					</div>
					{/* <div>
						<Row>
						<Col span={24}>
						<div className='text-end mr-4'>
							<AttendancePopup />
						</div>
					</Col>
						</Row>
					</div> */}
				</div>
			</div>
		</UserPrivateComponent>
		</>
	);
};

export default Dashboard;
