import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";

import { Card, DatePicker, Segmented, Table, Tag, Typography, Button } from "antd";
import dayjs from "dayjs";
import { forwardRef, Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
// 	loadAllAttendance,
// 	clearAttendanceList,
// } from "../../redux/rtk/features/attendance/attendanceSlice";
// import BtnSearchSvg from "../UI/Button/btnSearchSvg";
// import { VioletLinkBtn } from "../UI/AllLinkBtn";
// import Loader from "../loader/loader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { useReactToPrint } from "react-to-print";
import getSetting from "../../api/getSettings";
import "./style.css";

const PrintToPdf = forwardRef(({ data }, ref) => {
	const [invoiceData, setInvoiceData] = useState(null);
    useEffect(() => {
       getSetting().then((data) => setInvoiceData(data.result));
    }, []);
	return (
		<Fragment>
            <div ref={ref} className='wrapper'>
            <div className="box2">
                <h1>{invoiceData?.company_name.toUpperCase()}</h1>
                <h3>{invoiceData?.tagline}</h3>
                <p>{invoiceData?.address}</p>
                <p>{invoiceData?.phone}</p>
                <p>Email: {invoiceData?.email || "demo@demo.com"}</p>
                <p>Site web: {invoiceData?.website}</p>
            </div>

            <div className="box4">
                 <hr className="hr1" />
                 <h3 className="center">Liste des présences et absences</h3>
                 <hr className="hr1" />
           </div>

           <div className="box7">
          <table className="table1">
            <thead>
              {/* <th>ID</th> */}
              <th>Nom</th>
              <th>Heure d'arrivée</th>
              <th>Heure de depart</th>
              <th>Statut d'arrivée</th>
              <th>Statut de depart</th>
              <th>Heure Total</th>
            </thead>
            <tbody>
              {data && 
                data.map((i, index) => (
                  <tr key={i.id}>
                    {/* <td>{log.id}</td> */}
                    <td>{i.user?.firstName + " " + i.user?.lastName || "Utilisateur Inconnu"}</td>
                    <td>{dayjs(i.inTime).format("DD-MM-YY, HH:mm")}</td>
                    <td>{dayjs(i.outTime).format("DD-MM-YY HH:mm")}</td>
                    <td>{i.inTimeStatus}</td>
                    <td>{i.outTimeStatus}</td>
                    <td>{i.totalHour}</td>
                  </tr>
                 ))} 
            </tbody>
          </table>
        </div>
        <div className="box10">
          <hr />
          <p>Signature</p>
        </div>

        </div>
        </Fragment>
	);
});

const AttendancePrint = ({ data }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
	// const dispatch = useDispatch();
	// const { id } = useParams("id");

	// useEffect(() => {
	// 	dispatch(loadAllAttendance(id));

	// 	return () => {
	// 		dispatch(clearAttendanceList());
	// 	};
	// }, []);

	return (
		<div>
			<UserPrivateComponent permission={"readAll-attendance"}>
        <div>
           <div className="hidden">
             <PrintToPdf ref={componentRef} data={data} />
           </div>
             <Button type="primary" shape="round" onClick={handlePrint}>
               Imprimer
             </Button>
        </div>
			</UserPrivateComponent>
		</div>
	);
};

export default AttendancePrint;