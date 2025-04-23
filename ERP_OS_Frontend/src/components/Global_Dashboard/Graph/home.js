import React from "react";
import { Button, Row, Col, Typography } from "antd";
import { BsSpeedometer2, BsChatDots, BsCart4, BsPeople, BsHeartPulse, BsGraphUpArrow } from "react-icons/bs";
import Header from "../../layouts/Header"; // adapte le chemin si nécessaire
import Footer from "../../layouts/Footer"; // adapte le chemin si nécessaire
import "./home.css"; // styles personnalisés
import logo from "../../../assets/images/logo-jira.svg";

const { Title } = Typography;

const Home = () => {
	return (
		<div className="home-container">
			{/* <Header /> */}

			<div className="home-content">
				<Title style={{ marginBottom: "70px" }} level={2} >Bienvenue sur l'espace de Gestion</Title>

                <div className="logoContainer">
                <a href="/dashboard">
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover"
                    }}
                  />
                </a>
                </div>
				<Row gutter={[32, 32]} justify="center">
					<Col>
						<div className="home-button" onClick={() => window.location.href = "/dashboard"}>
							<BsSpeedometer2 className="icon" />
							<span>Dashboard</span>
						</div>
					</Col>
					<Col>
						<div className="home-button" onClick={() => window.location.href = "/dashboardsms"}>
							<BsGraphUpArrow className="icon" />
							<span>SMS</span>
						</div>
					</Col>
					<Col>
						<div className="home-button" onClick={() => window.location.href = "/dashboardsms"}>
							<BsCart4 className="icon" />
							<span>Ventes</span>
						</div>
					</Col>
					<Col>
						<div className="home-button" onClick={() => window.location.href = "/admin/dashboardrh"}>
							<BsPeople className="icon" />
							<span>Ressources Humaines</span>
						</div>
					</Col>
                    <Col>
                        <div className="home-button" onClick={() => window.location.href = "/"}>
                            <BsHeartPulse className="icon" />
                            <span>Soins</span>
                        </div>
                    </Col>
				</Row>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default Home;
