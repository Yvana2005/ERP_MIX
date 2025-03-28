import { DatePicker, Button, Card, Col, Form, Input, Row, Typography, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
// import { useParams } from "react-router-dom";
import { Navigate, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../page-header/PageHeader";
import getUserFromToken from "../../utils/getUserFromToken";
import {
    clearLeaveApplicationList,
	updateLeaveApplication,
	loadSingelLeaveApplication,
} from "../../redux/rtk/features/leave/leaveSlice";
import moment from "moment";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";



//Update Designation API REQ




const UpdateLeave = ( {drawer} ) => {
    const { Title } = Typography;
	const { id } = useParams("id");
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [loader, setLoader] = useState(false);
	const data = useSelector((state) => state.leave.leave);
	const userId = getUserFromToken();
	const [status, setStatus] = useState(null);

	const [initialValues, setInitialValues] = useState({});

	useEffect(() => {
		setInitialValues({
			...data,
			userId: userId,
            //leaveType: leaveType,
            status: status,
			leaveFrom: moment(data?.leaveFrom),
			leaveTo: moment(data?.leaveTo),
            //reason: reason,
		});
	}, [data]);


	const onFinish = async (values) => {
		const FormData = {
			...values,
		};
		const resp = await dispatch(
			updateLeaveApplication({ id: id, values: FormData })
		);

		if (resp.payload.message === "success") {
			setOpen(false);
			dispatch(loadSingelLeaveApplication(id));
			setLoader(false);
			setStatus(null);
		} else {
			setLoader(false);
		}
	};
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
		setLoader(false);
	};
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
		setStatus(null);
	};

	return (
		<>
			<PageTitle title={`Retour`} />
			<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-leaveApplication"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
							
							<Title level={3} className='m-3 text-center'>
							Modifier la demande
							</Title>
							<Form
								className='list-inside list-none border-2 border-inherit rounded px-5 py-5 m-5 mt-10'
                                form={form}
                                style={{ marginBottom: "40px" }}
                                name='basic'
                                initialValues={initialValues}
                                labelCol={{
                                    span: 7,
                                }}
                                wrapperCol={{
                                    span: 12,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete='off'>
								<Form.Item
									style={{ marginBottom: "10px" }}
									label='Type de congé'
									name='leaveType'
									rules={[
										{
											required: true,
											message: "Veuillez saisir votre quart de travail !",
										},
									]}>
									<Select
										mode='single'
										placeholder='Sélectionnez le type de congé'
										optionFilterProp='children'>
										<Select.Option value='PAID'>PAYÉ</Select.Option>
										<Select.Option value='UNPAID'>NON PAYÉ</Select.Option>
									</Select>
								</Form.Item>

                                <Form.Item
									style={{ marginBottom: "10px" }}
									label='Date de début'
									name='leaveFrom'
									rules={[
										{
											required: true,
											message: "Veuillez saisir votre quart de travail !",
										},
									]}>
									<DatePicker />
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Date de fin'
									name='leaveTo'
									rules={[
										{
											required: true,
											message: "Veuillez saisir votre quart de travail !",
										},
									]}>
									<DatePicker />
								</Form.Item>

								<Form.Item
					                style={{ marginBottom: "10px" }}
					                label="Motif du congé"
					                name="reason"
					                rules={[
					                  {
						                   required: true,
						                   message: "Veuillez saisir votre motif du congé"
					                  }
					                ]}
				                >
					                  <Input.TextArea placeholder='Justificatif du congé' />
				               </Form.Item> 


                               <Form.Item
								style={{ marginBottom: "10px" }}
								wrapperCol={{
									offset: 7,
									span: 12,
								}}>
								<Button
									onClick={() => setLoader(true)}
									type='primary'
									size='middle'
									htmlType='submit'
									block
									enabled={status === null}
									loading={loader}>
									Enregistrer
								</Button>
							</Form.Item>
							</Form>
						</Col>
				</Row>
                
			</UserPrivateComponent>
			</Fragment>
		</>
	);
}

export default UpdateLeave;
