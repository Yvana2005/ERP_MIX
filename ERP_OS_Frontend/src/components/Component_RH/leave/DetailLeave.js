import { Button, Card, Popover } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Loader from "../loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
	clearLeaveApplication,
	deleteLeaveApplication,
	loadSingelLeaveApplication,
} from "../../redux/rtk/features/leave/leaveSlice";
import tw from "tailwind-styled-components";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import PageTitle from "../page-header/PageHeader";
import dayjs from "dayjs";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import ReviewLeavePopup from "../UI/PopUp/ReviewLeavePopup";
// import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const DetailLeave = () => {
	const { id } = useParams("id");
	let navigate = useNavigate();
	const leave = useSelector((state) => state.leave.leave);
	const dispatch = useDispatch();

	//Delete Supplier
	const onDelete = async () => {
		try {
		  const resp = await dispatch(deleteLeaveApplication(id));
		  if (resp.payload.message === "success") {
			return navigate("/admin/leave");
		  }
		} catch (error) {
		  console.log(error.message);
		}
	};

	useEffect(() => {
		dispatch(loadSingelLeaveApplication(id));

		return () => {
			dispatch(clearLeaveApplication());
		};
	}, []);

	return (
		<div>
			<PageTitle title='Retour' />
			{/* <UserPrivateComponent permission={"create-leaveApplication"}> */}
				<Card className='mt-4'>
					<div className='text-center mb-4'>
						{" "}
						<h2 className='text-2xl font-semibold text-gray-600'>
						Demande de congé #{leave?.id}{" "}
						</h2>
					</div>
					{leave ? (
						<div className='flex justify-center '>
							<ul className='list-inside list-none border-2 border-inherit rounded px-5 py-5 '>
								<ListItem>
								Nom :{" "}
									<TextInside>
										{(
											leave?.user.firstName +
											" " +
											leave?.user.lastName
										).toUpperCase()}{" "}
									</TextInside>
								</ListItem>
								<ListItem>
								Type de congé : <TextInside>{leave.leaveType}</TextInside>
								</ListItem>
								<ListItem>
								Partir du :{" "}
									<TextInside>
										{dayjs(leave.leaveFrom).format("DD-MM-YYYY")}
									</TextInside>
								</ListItem>

								<ListItem>
								Jusqu'au :{" "}
									<TextInside>
										{dayjs(leave.leaveTo).format("DD-MM-YYYY")}
									</TextInside>
								</ListItem>

								<ListItem>
								Durée du congé :{" "}
									<TextInside className='text-red-500'>
										{leave.leaveDuration}
									</TextInside>
								</ListItem>

								<ListItem>
								Motif du congé :{" "}
									<TextInside>{leave.reason || "No reason"}</TextInside>
								</ListItem>

								<ListItem>
								Statut du congé :{" "}
									<TextInside>
										{leave.status === "PENDING" ? (
											<span className='text-yellow-500'>
												EN ATTENTE
											</span>
										) : leave.status === "ACCEPTED" ? (
											<span className='text-green-500'>
												{leave.status.toUpperCase()}
											</span>
										) : (
											<span className='text-red-500'>
												{leave.status.toUpperCase()}
											</span>
										)}
									</TextInside>
								</ListItem>

								<ListItem>
								Congé accepté à partir du :{" "}
									<TextInside>
										{leave.acceptLeaveFrom
											? dayjs(leave.acceptLeaveFrom).format("DD-MM-YYYY")
											: "EN REVUE"}
									</TextInside>
								</ListItem>

								<ListItem>
								jusqu'au :{" "}
									<TextInside>
										{leave.acceptLeaveTo
											? dayjs(leave.acceptLeaveTo).format("DD-MM-YYYY")
											: "EN REVUE"}
									</TextInside>
								</ListItem>

								<ListItem>
								Congé accepté par :{" "}
									<TextInside className='text-green-500'>
										{(leave.acceptLeaveBy?.firstName || "EN") +
											" " +
											(leave.acceptLeaveBy?.lastName || "REVUE")}
									</TextInside>
								</ListItem>

								<ListItem>
								Commentaire de révision :{" "}
									<TextInside>{leave.reviewComment || "AUCUN"}</TextInside>
								</ListItem>

								<ListItem>
								Pièce jointe :{" "}
									<TextInside>
										{leave.attachment ? (
											<a
												href={leave.attachment}
												target='_blank'
												rel='noreferrer'
												className='text-blue-500'>
												Télécharger
											</a>
										) : (
											"Pas de pièces Jointes"
										)}
									</TextInside>
								</ListItem>
								<ListItem>
								Supprimer : {" "}
								<UserPrivateComponent permission={"delete-leaveApplication"}>
											<Popover
												>
												<Button
												    onClick={onDelete}
													type='danger'
													DetailLeave
													shape='round'
													icon={<DeleteOutlined />}></Button>
											</Popover>
								</UserPrivateComponent>
								</ListItem>
							</ul>
						</div>
					) : (
						<Loader />
					)}
					<UserPrivateComponent permission={"readAll-leaveApplication"}>
						{leave?.status === "PENDING" && (
							<div className='flex justify-center items-center'>
								<ReviewLeavePopup />
							</div>
						)}
						{leave?.status === "REJECTED" && (
							<div className='flex justify-center items-center'>
								<ReviewLeavePopup />
							</div>
						)}
					</UserPrivateComponent>
				</Card>
			{/* </UserPrivateComponent> */}
		</div>
	);

	// "reviewComment": null,
	// "attachment": null,
};

const ListItem = tw.li`
text-sm
text-gray-600
font-semibold
py-2
px-4
bg-gray-100
mb-1.5
rounded
w-96
flex
justify-start
`;

const TextInside = tw.p`
ml-2
text-sm
text-gray-900
`;
export default DetailLeave;
