import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
	Typography,
} from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { addSingleProject } from "../../redux/rtk/features/projectManagement/project/project/project";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import PageTitle from "../page-header/PageHeader";

const AddProject = ({ drawer }) => {
	const [loader, setLoader] = useState(false);
	const userList = useSelector((state) => state.users.list);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAllStaff({ status: "true" }));
	}, []);

	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		const projectData = {
			...values,
			startDate: dayjs(values.startDate).format(),
			endDate: dayjs(values.endDate).format(),
		};

		setLoader(true);
		const resp = await dispatch(addSingleProject(projectData));

		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding Project");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			{/* <UserPrivateComponent permission={"create-leaveApplication"}> */}
			<PageTitle title={"Retour"} />
			<Row className='mr-top' justify={drawer ? "center" : "center"}>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={drawer ? 22 : 18}
					xl={drawer ? 22 : 16}
					className='column-design border rounded card-custom'>
					<Title level={4} className='m-2 mt-5 mb-5 text-center'>
					Ajouter un nouveau projet
					</Title>
					<Form
						form={form}
						style={{ marginBottom: "40px" }}
						eventKey='shift-form'
						name='basic'
						labelCol={{
							span: 7,
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
								label='Chef du Projet'
								name='projectManagerId'
								rules={[
									{
										required: true,
										message: "Select Project Manager",
									},
								]}>
								<Select
									loading={!userList.length}
									mode='single'
									showSearch
									placeholder='Selectioner un chef de projet'
									optionFilterProp='children'>
									{userList.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.firstName} {item.lastName}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Nom du Projet'
								name='name'
								rules={[
									{
										required: true,
										message: "Entrer un nom ",
									},
								]}>
								<Input placeholder='Enter Project Name' />
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Date de debut'
								name='startDate'
								rules={[
									{
										required: true,
										message: "Entrer la date de début du projet!",
									},
								]}>
								<DatePicker />
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "20px" }}
								label='Date de fin'
								name='endDate'
								rules={[
									{
										required: true,
										message: "Entrer la date de fin du projet!!",
									},
								]}>
								<DatePicker />
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "20px" }}
								label='Description du projet'
								name='description'
								rules={[
									{
										required: true,
										message: "Entrer une Description du projet",
									},
								]}>
								<Input.TextArea placeholder='Entrer une Description du projet' />
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
									size='large'
									htmlType='submit'
									block
									loading={loader}>
								Soumettre
								</Button>
							</Form.Item>
						</div>
					</Form>
				</Col>
			</Row>
			{/* </UserPrivateComponent> */}
		</Fragment>
	);
};

export default AddProject;
