import { Col, Row, Image, Avatar, Typography, Divider, Button } from "antd";
import dayjs from "dayjs";
import React, {
	forwardRef,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import getSetting from "../../api/getSettings";

import { useDispatch, useSelector } from "react-redux";
import {
	clearUser,
  loadSingleStaff
} from "../../redux/rtk/features/user/userSlice";
import { useParams } from "react-router-dom";
import PrintIconSVG from "../Component_RH/Icons/PrintIconSVG";
import tw from "tailwind-styled-components";
import Loader from "../loader/loader";
import UserPrivateComponent from "../Component_RH/PrivateRoutes/UserPrivateComponent";

const UserPrintSheet = forwardRef(({ data }, ref) => {
    const [invoiceData, setInvoiceData] = useState(null);
    useEffect(() => {
       getSetting().then((data) => setInvoiceData(data.result));
    }, []);
	const { Title, Text } = Typography;

    return (
        <div ref={ref} className="p-8 border border-gray-300 shadow-lg bg-white w-full max-w-2xl mx-auto">
          <Title level={2} className="text-center text-gray-700">FICHE DE L'EMPLOYÉ</Title>
          <Divider />
          <Row gutter={[24, 24]}>
          <Col span={12}>
				<TitleText>{invoiceData?.company_name.toUpperCase()}</TitleText>
				<TitleText2>{invoiceData?.email || "demo@demo.com"}</TitleText2>
				<TitleText2>{invoiceData?.phone}</TitleText2>
		 </Col>
         <Divider />

         </Row>
          {/* Informations Personnelles */}
          <Row gutter={[16, 16]}>
            <Col span={12}><Text strong>Nom :</Text> {data?.lastName.toUpperCase()}</Col>
            <Col span={12}><Text strong>Prénom :</Text> {data?.firstName.toUpperCase()}</Col>
            <Col span={12}><Text strong>Date de Naissance :</Text> {dayjs(data?.Birthday).format("DD-MM-YYYY")}</Col>
            <Col span={12}><Text strong>Matricule :</Text> {data?.employeeId}</Col>
          </Row>
          <Divider dashed />
          
          {/* Informations Professionnelles */}
          <Row gutter={[16, 16]}>
            <Col span={12}><Text strong>Département :</Text> {data?.department?.name}</Col>
            <Col span={12}><Text strong>Poste :</Text> {data?.designationHistory?.designation?.name}
            {data?.designationHistory?.length > 0 ? data.designationHistory[data.salaryHistory.length - 1].designation?.name 
    : "_________"} </Col>
            <Col span={12}><Text strong>Statut :</Text> {data?.employmentStatus?.name}</Col>
            <Col span={12}><Text strong>Date d'embauche :</Text> {dayjs(data?.joinDate).format("DD-MM-YYYY")}</Col>
            <Col span={12}><Text strong>Rôle :</Text> {data?.role?.name}</Col>
            <Col span={12}><Text strong>Salaire :</Text> {data?.salaryHistory?.length > 0 
    ? data.salaryHistory[data.salaryHistory.length - 1].salary 
    : "_________"}  Fcfa</Col>
            <Col span={12}><Text strong>Numéro CNPS :</Text> {data?.CnpsId}</Col>
          </Row>
          <Divider dashed />
          
          {/* Informations de Contact */}
          <Row gutter={[16, 16]}>
            <Col span={12}><Text strong>Email :</Text> {data?.email}</Col>
            <Col span={12}><Text strong>Téléphone :</Text> {data?.phone}</Col>
            <Col span={12}><Text strong>Adresse :</Text> {data?.street}</Col>
            <Col span={12}><Text strong>Situation matrimoniale :</Text> {data?.maritalstatus}</Col>
          </Row>
          <Divider dashed />
          
          {/* Contact d'urgence */}
          <Title level={4} className="text-gray-600">Contact d'urgence</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}><Text strong>Nom :</Text> {(data?.emergencyname1 + " " + data?.emergencyforename1).toUpperCase()} </Col>
            <Col span={12}><Text strong>Téléphone :</Text> {data?.emergencyPhone1}</Col>
            <Col span={12}><Text strong>Lien de parenté :</Text> {data?.emergencylink1}</Col>
          </Row>
        </div>
      );
});

const PrintUserSheet = ({ data }) => {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div>
			<UserPrivateComponent permission={"delete-user"}>
                <div>
           <div className="hidden">
             <UserPrintSheet ref={componentRef} data={data} />
           </div>
             <Button type="primary" shape="round" onClick={handlePrint}>
               Imprimer
             </Button>
        </div>
			</UserPrivateComponent>
		</div>
	);
};

const TitleText = tw.span`
text-sm
font-semibold
text-slate-700

`;

const TitleText2 = tw.div`
text-sm
text-slate-600

`;
const TitleText3 = tw.span`
text-sm
text-slate-600

`;
export default PrintUserSheet;