import { Button, Card, Col, Form, Input, Row, Table, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import ViewBtn from "../Buttons/ViewBtn";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import {
	addSingleAward,
	loadAllAward,
} from "../../../redux/rtk/features/award/awardSlice";
import { addAward } from "../../../redux/rtk/features/award/awardSlice";
import PageTitle from "../../page-header/PageHeader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const AddAward = ({ drawer }) => {
	const { list, loading } = useSelector((state) => state.award);
	const [loader, setLoader] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAllAward());
	}, []);

	const { Title } = Typography;

	const onFinish = async (values) => {
		setLoader(true);
		const resp = await dispatch(addSingleAward(values));

		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
			dispatch(loadAllAward());
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Échec de l'ajout du département");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<PageTitle title='Retour' />

			<UserPrivateComponent permission={"create-award"}>
				<Row className='mr-top' justify={drawer ? "center" : "space-between"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
						Ajouter une récompense
						</Title>
						<Form
							style={{ marginBottom: "40px" }}
							form={form}
							eventKey='department-form'
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
									label='Nom'
									name='name'
									rules={[
										{
											required: true,
											message: "Veuillez saisir le nom de votre récompense !",
										},
									]}>
									<Input placeholder="L'employer du mois" />
								</Form.Item>

								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Description'
									name='description'
									rules={[
										{
											required: true,
											message: "Veuillez saisir la description de votre récompense !",
										},
									]}>
									<Input placeholder="L'employé qui a bien performé" />
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

export default AddAward;
