import { Button, DatePicker, Drawer, Form, Input, Radio } from "antd";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
	loadSingelLeaveApplication,
	reviewLeaveApplication,
} from "../../../../redux/rtk/features/leave/leaveSlice";
import getUserFromToken from "../../../../utils/getUserFromToken";
import moment from "moment";

const ReviewLeavePopup = () => {
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
			status: status,
			acceptLeaveFrom: moment(data?.leaveFrom),
			acceptLeaveTo: moment(data?.leaveTo),
		});
	}, [data]);

	const onFinish = async (values) => {
		const FormData = {
			...values,
		};
		const resp = await dispatch(
			reviewLeaveApplication({ id: id, values: FormData })
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
			<Button onClick={showDrawer} className='mt-4' type='primary'>
			Révision du Congé
			</Button>
			{data && (
				<Drawer
					width={720}
					title='Vue du congé'
					placement='right'
					onClose={onClose}
					open={open}>
					<h2 className='text-2xl font-semibold mb-4 text-center mt-5'>
					Valider le congé
					</h2>
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
						<div>
							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Accepter Du'
								name='acceptLeaveFrom'
								rules={[
									{
										required: true,
										message: "Please input Date !",
									},
								]}>
								<DatePicker format={"DD-MM-YYYY"} />
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								label="Jusqu'au"
								name='acceptLeaveTo'
								rules={[
									{
										required: true,
										message: "Please input Date!",
									},
								]}>
								<DatePicker format={"DD-MM-YYYY"} />
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Commentaire'
								name='reviewComment'>
								<Input name='reviewComment' />
							</Form.Item>

							{status === null && (
								<p className='text-red-500 text-center mb-3'>
									Veuillez sélectionner le statut
								</p>
							)}

							<Form.Item
								style={{ marginBottom: "10px" }}
								label='Selectionner le Statut'
								name='status'
								rules={[
									{
										required: true,
										message: "Please input Status!",
									},
								]}>
								<Radio.Group
									buttonStyle='solid'
									onChange={(e) => setStatus(e.target.value)}>
									<Radio.Button value='ACCEPTED'>ACCEPTÉ</Radio.Button>
									<Radio.Button value='REJECTED'>REJECTÉ</Radio.Button>
								</Radio.Group>
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
									disabled={status === null}
									loading={loader}>
									Enregistrer
								</Button>
							</Form.Item>
						</div>
					</Form>
				</Drawer>
			)}
		</>
	);
};
export default ReviewLeavePopup;
