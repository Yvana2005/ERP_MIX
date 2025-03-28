import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Popover } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	clearDesignation,
	deleteDesignation,
	loadAllDesignationByEmployee,
	loadSingleDesignation,
} from "../../redux/rtk/features/designation/designationSlice";
import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";
import UserListCard from "./List/UserListCard";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
//PopUp

const DetailDesignation = () => {
	const { id } = useParams();
	let navigate = useNavigate();

	//dispatch
	const dispatch = useDispatch();
	const { designation, loading } = useSelector((state) => state.designations);

	
	// Delete Supplier PopUp
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	useEffect(() => {
		dispatch(loadSingleDesignation(id));
		return () => {
			dispatch(clearDesignation());
		};
	}, []);

	//Delete Supplier
	const onDelete = () => {
		try {
			dispatch(deleteDesignation(id));

			setVisible(false);
			toast.warning(`Designation : ${designation.name} is removed `);
			return navigate("/admin/designation");
		} catch (error) {
			console.log(error.message);
		}
	};

	
	// const onDelete = async () => {
	// 	if (!designation || !designation.id) {
	// 	  return toast.error("Le département est introuvable !");
	// 	}
	  
	// 	try {
	// 	  const confirmDelete = window.confirm(
	// 		`Voulez-vous vraiment supprimer le département : ${designation.name} ?`
	// 	  );
	  
	// 	  if (!confirmDelete) return;
	  
	// 	  // Utilisation de la fonction API `deleteDepartment`
	// 	  const response = await deleteDesignation(designation.id);
	// 	  console.log("Réponse API suppression :", response);
	  
	// 	  if (response.message === "success") {
	// 		toast.success(`Le poste ${designation.name} a été supprimé.`); 
			
	// 		navigate("/admin/designation");
	// 	  } else {
	// 		toast.error("Échec de la suppression de la designation !");
	// 	  }
	// 	} catch (error) {
	// 	  console.error("Erreur de suppression :", error);
	// 	  toast.error("Une erreur est survenue lors de la suppression !");
	// 	}
	//   };

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}

	return (
		<div>
			<PageTitle title=' Retour ' subtitle=' ' />

			<div className='mr-top'>
				<UserPrivateComponent permission={"readSingle-designation"}>
					{designation ? (
						<Fragment key={designation.id}>
							<Card bordered={false} style={{}}>
								<div className='flex justify-between' style={{ padding: 0 }}>
									<div className='w-50'>
										<h5>
											<i className='bi bi-person-lines-fill'></i>
											<span className='mr-left text-xl'>
												ID : {designation.designationId} | {designation.name}
											</span>
										</h5>
									</div>
									<div className='text-end w-50'>
										<UserPrivateComponent permission={"update-designation"}>
											<Link
												className='mr-3 d-inline-block'
												to={`/admin/designation/${designation.designationId}/update`}
												state={{ data: designation }}>
												<Button
													type='primary'
													shape='round'
													icon={<EditOutlined />}></Button>
											</Link>
										</UserPrivateComponent>
										<UserPrivateComponent permission={"delete-designation"}>
											<Popover
												>
												<Button
												    onClick={onDelete}
													type='danger'
													DetailDesignation
													shape='round'
													icon={<DeleteOutlined />}></Button>
											</Popover>
										</UserPrivateComponent>
									</div>
								</div>

								<UserListCard list={designation.employee} loading={loading} />
							</Card>
						</Fragment>
					) : (
						<Loader />
					)}
				</UserPrivateComponent>
			</div>
		</div>
	);
};

export default DetailDesignation;
