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
import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import {
	addAwardHistory,
	loadAllAwardHistory,
} from "../../../redux/rtk/features/awardHistory/awardHistorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { loadAllAward } from "../../../redux/rtk/features/award/awardSlice";
import { loadSingleStaff } from "../../../redux/rtk/features/user/userSlice";
import { useParams } from "react-router-dom";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const AddAwardHistory = ({ setLoading }) => {
	const [loader, setLoader] = useState(false);
	const dispatch = useDispatch();

	const { id } = useParams("id");

	const award = useSelector((state) => state?.award.list);

	useEffect(() => {
		dispatch(loadAllAward());
	}, [dispatch]);

	const { Title } = Typography;
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		setLoading(true);
		const FormData = {
			...values,
			userId: parseInt(id),
		};
		setLoader(true);
		const resp = await dispatch(addAwardHistory(FormData));

		if (resp.payload.message === "success") {
			setLoader(false);
			setLoading(false);
			form.resetFields();

			dispatch(loadSingleStaff(id));
		} else {
			setLoader(false);
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Échec de l'ajout de la récompense");
		setLoader(false);
		setLoading(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-awardHistory"}>
				<Row className='mr-top' justify='center'> 
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
						Ajouter l'historique des récompenses
						</Title>
						<Form
							form={form}
							style={{ marginBottom: "50px" }}
							eventKey='department-form'
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
									label='Nom du prix'
									name='awardId'
									rules={[{ required: true }]}>
									<Select placeholder='Sélectionnez le prix' loading={!award}>
										{award &&
											award.map((award) => (
												<Select.Option key={award.id} value={award.id}>
													{award.name}
												</Select.Option>
											))}
									</Select>
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "10px" }}
									label="Date d'attribution"
									name='awardedDate'
									rules={[
										{
											required: true,
											message: "Veuillez saisir votre date d'attribution !",
										},
									]}>
									<DatePicker />
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Commentaire'
									name='comment'>
									<Input />
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
										size='small'
										htmlType='submit'
										block
										loading={loader}>
										Ajouter une nouvelle récompense
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
			<hr />
		</Fragment>
	);
};

export default AddAwardHistory;
