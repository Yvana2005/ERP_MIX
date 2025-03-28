import { Button, Col, DatePicker, Form, Row, Select, Typography, Input } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
	loadAllShift,
	loadSingleShift,
} from "../../redux/rtk/features/shift/shiftSlice";
import { addLeaveApplication } from "../../redux/rtk/features/leave/leaveSlice";
import getUserFromToken from "../../utils/getUserFromToken";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const AddLeave = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	const shift = useSelector((state) => state.shift.list);

	//get id from JWT token in localstorage and decode it

	const id = getUserFromToken();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAllShift());
	}, []);

	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		const leaveData = {
			...values,
			userId: id,
			leaveFrom: dayjs(values.leaveFrom).format(),
			leaveTo: dayjs(values.leaveTo).format(),
		};

		setLoader(true);
		const resp = await dispatch(addLeaveApplication(leaveData));

		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
			dispatch(loadAllShift());
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Échec de l'ajout de la periode de travail");
		setLoader(false);
	};
	return (
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
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
						Demande de congé
						</Title>
						<Form
							form={form}
							style={{ marginBottom: "40px" }}
							eventKey='shift-form'
							name='basic'
							labelCol={{
								span: 6,
							}}
							wrapperCol={{
								span: 12,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							<div>
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
										offset: 6,
										span: 12,
									}}>
									<Button
										onClick={() => setLoader(true)}
										type='primary'
										size='large'
										htmlType='submit'
										block
										loading={loader}>
										Soumettre un congé
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default AddLeave;
