import {
	Alert,
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Switch,
	Typography
  } from "antd";
  
  import { Fragment, useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { loadAllDesignation } from "../../redux/rtk/features/designation/designationSlice";
  import BigDrawer from "../Component_RH/Drawer/BigDrawer";
  import AddRole from "../role/AddRole";
  import { getRoles } from "../role/roleApis";
  import EmployeeEducationForm from "./EmployeeEducationForm";
  import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
  import { getDepartments } from "../Component_RH/department/departmentApis";
  import { loadAllEmploymentStatus } from "../../redux/rtk/features/employemntStatus/employmentStatusSlice";
  // import { loadAllShift } from "../../redux/rtk/features/shift/shiftSlice";
  //import { addStaff } from "../../redux/actions/user/addStaffAciton";
  import { addStaff } from "../../redux/rtk/features/user/userSlice";
  // import { loadAllWeeklyHoliday } from "../../redux/rtk/features/weeklyHoliday/weeklyHolidaySlice";
  // import { loadAllLeavePolicy } from "../../redux/rtk/features/leavePolicy/leavePolicySlice";
  import UserPrivateComponent from "../Component_RH/PrivateRoutes/UserPrivateComponent";
  
  const AddUser = () => {
	const [loader, setLoader] = useState(false);
	const dispatch = useDispatch();
	const { Title } = Typography;
	const { Option } = Select;
	const [list, setList] = useState(null);
	const [department, setDepartment] = useState(null);
  
	const [education, setEducation] = useState([
	  {
		degree: "",
		institution: "",
		qualification: "",
		skill: ""
	  }
	]);
  
	// const [j_date, setJ_date] = useState(dayjs());
	// const [l_date, setL_date] = useState(dayjs());
  
	// useseletor to get designations from redux
	const designation = useSelector((state) => state.designations?.list);
	const employmentStatus = useSelector((state) => state.employmentStatus?.list);
	// const shift = useSelector((state) => state.shift?.list);
	// const weeklyHoliday = useSelector((state) => state.weeklyHoliday?.list);
	// const leavePolicy = useSelector((state) => state.leavePolicy?.list);
  
	useEffect(() => {
	  getRoles()
		.then((d) => setList(d))
		.catch((error) => console.log(error));
	}, []);
  
	useEffect(() => {
	  getDepartments()
		.then((d) => setDepartment(d))
		.catch((error) => console.log(error));
	}, []);
  
	useEffect(() => {
	  dispatch(loadAllDesignation());
	  dispatch(loadAllEmploymentStatus());
	  // dispatch(loadAllShift());
	  // dispatch(loadAllWeeklyHoliday());
	  // dispatch(loadAllLeavePolicy());
	}, []);
  
	const [form] = Form.useForm();
  
	const onFinish = async (values) => {
	  const FormData = {
		...values,
  
		educations: values.educations || education
	  };
	  try {
		const resp = await dispatch(addStaff(FormData));
		setLoader(true);
  
		if (resp.payload.message === "success") {
		  form.resetFields();
		  setLoader(false);
		} else if (resp.payload.message === "error") {
		  setLoader(false);
		} else {
		  setLoader(false);
		}
	  } catch (error) {
		console.log(error.message);
		setLoader(false);
	  }
	};
  
	const onFinishFailed = (errorInfo) => {
	  setLoader(false);
	  console.log("Failed:", errorInfo);
	};
  
	const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]; // blood groups
	const maritalstatuss = [
	  "marié(e)",
	  "Célibataire",
	  "Marié(e) avec enfant(s)",
	  "Marié(e) sans enfant(s)",
	  "Veuf/Veuve"
	]; // Statut marital
	const Categories = ["A", "B", "C"]; // Catégories Pro
	const Genders = ["Homme", "Femme"];
	const Languages = ["Francais", "Anglais", "Autre"];
  
	return (
	  <Fragment>
		<UserPrivateComponent permission={"create-user"}>
		  <div className="mr-top mt-5 p-5 ant-card " style={{ maxWidth: "100%" }}>
			<Form
			  size="small"
			  form={form}
			  name="basic"
			  labelCol={{
				span: 7
			  }}
			  wrapperCol={{
				span: 22
			  }}
			  initialValues={{
				remember: true
			  }}
			  onFinish={onFinish}
			  onFinishFailed={onFinishFailed}
			  autoComplete="off"
			>
			  <Row
				gutter={{
				  xs: 8,
				  sm: 16,
				  md: 24,
				  lg: 32
				}}
			  >
				<Col span={12} className="gutter-row form-color">
				  <h2 className="text-center text-xl mt-3 mb-3 txt-color">
					<b>Informations de l'utilisateur</b>
				  </h2>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Prénom"
					name="firstName"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Prenom!"
					  }
					]}
				  >
					<Input placeholder="Prénom" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Nom de famille"
					name="lastName"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Nom de famille!"
					  }
					]}
				  >
					<Input placeholder="Nom" />
				  </Form.Item>
				  
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Nom d'utilisateur"
					name="username"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Nom d'utilisateur!"
					  }
					]}
				  >
					<Input placeholder="Nom d'utilisateur" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Mot de passe"
					name="password"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre your password !"
					  }
					]}
				  >
					<Input placeholder="Mot de passe fort" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Email"
					name="email"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre e-mail !"
					  }
					]}
				  >
					<Input placeholder="Email@example.com" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Date de naissance"
					name="Birthday"
					rules={[
					  {
						required: true,
						message: "Choisir votre date de naissance!"
					  }
					]}
				  >
					<DatePicker className="date-picker hr-staffs-date-picker" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Ville de Naissance"
					name="city"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Ville de Naissance!"
					  }
					]}
				  >
					<Input placeholder="Bafang" />
				  </Form.Item>
				</Col>
				<Col span={12} className="gutter-row">
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Nom du père"
					name="fathername"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Nom du père!"
					  }
					]}
				  >
					<Input placeholder="Nom du père" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="langue officielle"
					name="speech"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir la langue officielle!"
					  }
					]}
					>
					<Select
					  placeholder="Selectionnez votre langue officielle"
					  allowClear
					  mode="single"
					  size="middle"
					  style={{
						width: "100%"
					  }}
					>
					  {Languages.map((speech) => (
						<Option key={speech} value={speech}>
						  {speech}
						</Option>
					  ))}
					</Select>
				  
					{/* <Input placeholder="langue officielle" /> */}
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Nom de la mère"
					name="mothername"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Nom de la mère!"
					  }
					]}
				  >
					<Input placeholder="Nom de la mère" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Adresse"
					name="street"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Adresse !"
					  }
					]}
				  >
					<Input
					  placeholder="New-bell/Douala"
					  style={{ width: "100%" }}
					/>
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Code postal"
					name="zipCode"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre code postal!"
					  }
					]}
				  >
					<Input placeholder="90211" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Etat Civil"
					name="maritalstatus"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre situation maritale!"
					  }
					]}
				  >
					<Select
					  placeholder="Selectionnez votre situation maritale"
					  allowClear
					  mode="single"
					  size="middle"
					  style={{
						width: "100%"
					  }}
					>
					  {maritalstatuss.map((maritalstatus) => (
						<Option key={maritalstatus} value={maritalstatus}>
						  {maritalstatus}
						</Option>
					  ))}
					</Select>
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Genre"
					name="gender"
					rules={[
					  {
						required: true,
						message: "Veuillez sélectionner votre Genre!"
					  }
					]}
				  >
					<Select
					  placeholder="Selectionnez votre Genre"
					  allowClear
					  mode="single"
					  size="middle"
					  style={{
						width: "100%"
					  }}
					>
					  {Genders.map((gender) => (
						<Option key={gender} value={gender}>
						  {gender}
						</Option>
					  ))}
					</Select>
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Télephone"
					name="phone"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Contact télephonique!"
					  }
					]}
				  >
					<Input placeholder="Télephone" />
				  </Form.Item>
				</Col>
			  </Row>
  
			  <Row
				gutter={{
				  xs: 8,
				  sm: 16,
				  md: 24,
				  lg: 32
				}}
			  >
				<Col span={12} className="gutter-row">
				  <h2 className="text-center text-xl mt-3 mb-3 txt-color">
					{" "}
					<b>Statut de l’employé</b>{" "}
				  </h2>
  
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Date d'embauche"
					name="joinDate"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre date d'adheration!"
					  }
					]}
				  >
					<DatePicker className="date-picker hr-staffs-date-picker" />
				  </Form.Item>
  
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Matricule Interne "
					name="employeeId"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Identifiant !"
					  }
					]}
				  >
					<Input placeholder="OE-012" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Matricule CNPS "
					name="CnpsId"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Matricule CNPS !"
					  }
					]}
				  >
					<Input placeholder="CNPS-012" />
				  </Form.Item>
				  {/* TODO: Add a Upload Seciton for Image */}
				  <Form.Item
					name={"employmentStatusId"}
					style={{ marginBottom: "10px" }}
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Statut d'emploi!"
					  }
					]}
					label="Statut de l'emploie"
				  >
					<Select
					  placeholder="Selectionnez un Statut"
					  allowClear
					  size={"middle"}
					>
					  {employmentStatus &&
						employmentStatus.map((employmentStatus) => (
						  <Option
							key={employmentStatus.id}
							value={employmentStatus.id}
						  >
							{employmentStatus.name}
						  </Option>
						))}
					</Select>
				  </Form.Item>
				  <Form.Item
					name={"departmentId"}
					style={{ marginBottom: "10px" }}
					label="Departement"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Departement!"
					  }
					]}
				  >
					<Select
					  loading={!department}
					  placeholder="Selectionnez un Departement"
					  allowClear
					  size={"middle"}
					>
					  {department &&
						department.map((department) => (
						  <Option key={department.id} value={department.id}>
							{department.name}
						  </Option>
						))}
					</Select>
				  </Form.Item>
				  <Form.Item
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Role!"
					  }
					]}
					label="Role"
					name={"role"}
					style={{ marginBottom: "10px" }}
				  >
					<Select
					  loading={!list}
					  size="middle"
					  mode="single"
					  allowClear
					  style={{
						width: "100%"
					  }}
					  placeholder="Please select"
					>
					  {list &&
						list.map((role) => (
						  <Option key={role.name}>
							{role.name}
						  </Option>
						))}
					</Select>
					{/*<BigDrawer
										  title={"new Role"}
										  btnTitle={"Role"}
										  children={<AddRole drawer={true} />}
											  /> */}
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Catégorie"
					name="Category"
					rules={[
					  {
						required: true,
						message: "Veuillez Sélectionner votre catégorie!"
					  }
					]}
				  >
					<Select
					  placeholder="Selectionnez votre catégorie"
					  allowClear
					  mode="single"
					  size="middle"
					  style={{
						width: "100%"
					  }}
					>
					  {Categories.map((Category) => (
						<Option key={Category} value={Category}>
						  {Category}
						</Option>
					  ))}
					</Select>
				  </Form.Item>
  
				  <Form.Item
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Poste Occupé!"
					  }
					]}
					label="Titre du Poste"
					name={"designationId"}
					style={{ marginBottom: "10px" }}
				  >
					<Select
					  size="middle"
					  mode="single"
					  allowClear
					  style={{
						width: "100%"
					  }}
					  placeholder="Veuillez selectionnez le titre du poste"
					>
					  {designation &&
						designation.map((designation) => (
						  <Option key={designation.id} value={designation.id}>
							{designation.name}
						  </Option>
						))}
					</Select>
					{/*<BigDrawer
									  title={"new Role"}
									  btnTitle={"Role"}
									  children={<AddRole drawer={true} />}
										  /> */}
				  </Form.Item>
  
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Salaire"
					name="salary"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre salaire"
					  }
					]}
				  >
					<InputNumber style={{ width: "100%" }} />
				  </Form.Item>
  
				  <Form.Item
					label="Date de début du salaire"
					name="salaryStartDate"
					style={{ marginBottom: "10px" }}
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre date de debut de salaire!"
					  }
					]}
				  >
					<DatePicker className="date-picker hr-staffs-date-picker" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Supérieur Hiérachique"
					name="uppername"
				  >
					<Input placeholder="Veuillez saisir le nom de votre supérieur hiérachique" />
				  </Form.Item>
				  {/* <Form.Item
					rules={[
					  {
						required: true,
						message: "Veuillez saisir votre Department!"
					  }
					]}
					label="Shift"
					name={"shiftId"}
					style={{ marginBottom: "10px" }}
				  >
					<Select
					  loading={!shift}
					  size="middle"
					  mode="single"
					  allowClear
					  style={{
						width: "100%"
					  }}
					  placeholder="Please select"
					>
					  {shift &&
						shift.map((shift) => (
						  <Option key={shift.id} value={shift.id}>
							{shift.name}
						  </Option>
						))}
					</Select>
					<BigDrawer
					title={"new Role"}
					btnTitle={"Role"}
					children={<AddRole drawer={true} />}
				  />
				  </Form.Item> */}
				</Col>
				<Col span={12} className="gutter-row">
				  <h2 className="text-center text-xl mt-3 mb-3 txt-color">
					<b>Personne à joindre en cas d’urgence</b>
				  </h2>
  
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Nom d'un proche"
					name="emergencyname1"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Nom d'un proche!"
					  }
					]}
				  >
					<Input placeholder="Nom d'un proche" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Prénom d'un proche"
					name="emergencyforename1"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Prénom d'un proche!"
					  }
					]}
				  >
					<Input placeholder="Prénom d'un proche" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Contact d'un proche"
					name="emergencyPhone1"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Contact d'un proche!"
					  }
					]}
				  >
					<Input placeholder="Contact d'un proche" />
				  </Form.Item>
				  <Form.Item
					style={{ marginBottom: "10px" }}
					label="Lien Avec ce proche"
					name="emergencylink1"
					rules={[
					  {
						required: true,
						message: "Veuillez saisir le Lien avec ce proche!"
					  }
					]}
				  >
					<Input placeholder="Lien avec ce proche" />
				  </Form.Item>
				  <br></br>
				  <h2 className="text-center text-xl mt-3 mb-5 txt-color">
					<b> Informations sur l'éducation</b>
				  </h2>
  
				  <div className="text-center">
					<p className="text-red-500 text-base mb-4">
					  Veuillez ajouter des informations sur l'éducation en
					  utilisant le bouton ci-dessous
					</p>
				  </div>
  
				  <Form.List name="educations">
					{(fields, { add, remove }) => (
					  <>
						{fields.map(({ key, name, ...restField }) => (
						  <EmployeeEducationForm
							key={key}
							name={name}
							remove={remove}
							restField={restField}
						  />
						))}
						<Form.Item
						  style={{ marginBottom: "10px" }}
						  wrapperCol={{
							offset: 4,
							span: 16
						  }}
						>
						  <Button
							type="dashed"
							size="middle"
							style={{ color: "#fff", backgroundColor: "#2c3e50" }}
							onClick={() => add()}
							block
							icon={<PlusOutlined />}
						  >
							Ajouter des informations sur l'éducation
						  </Button>
						</Form.Item>
					  </>
					)}
				  </Form.List>
				</Col>
			  </Row>
			  {/* <Row>
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Région"
				  name="state"
				  rules={[
					{ required: true, message: "Veuillez saisir votre région!" }
				  ]}
				>
				  <Input placeholder="Centre" />
				</Form.Item>
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Pays"
				  name="country"
				  rules={[
					{ required: true, message: "Veuillez saisir votre pays!" }
				  ]}
				>
				  <Input placeholder="USA" />
				</Form.Item>
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Groupe Sanguin"
				  name="bloodGroup"
				  rules={[
					{
					  required: true,
					  message: "Veuillez saisir votre Groupe Sanguin!"
					}
				  ]}
				>
				  <Select
					placeholder="Selectionnez votre Groupe Sanguin"
					allowClear
					mode="single"
					size="middle"
					style={{
					  width: "100%"
					}}
				  >
					{bloodGroups.map((bloodGroup) => (
					  <Option key={bloodGroup} value={bloodGroup}>
						{bloodGroup}
					  </Option>
					))}
				  </Select>
				</Form.Item>
				<Form.Item
				  rules={[
					{
					  required: true,
					  message: "Veuillez saisir votre Department!"
					}
				  ]}
				  label="Shift"
				  name={"shiftId"}
				  style={{ marginBottom: "10px" }}
				>
				  <Select
					loading={!shift}
					size="middle"
					mode="single"
					allowClear
					style={{
					  width: "100%"
					}}
					placeholder="Please select"
				  >
					{shift &&
					  shift.map((shift) => (
						<Option key={shift.id} value={shift.id}>
						  {shift.name}
						</Option>
					  ))}
				  </Select>
				  <BigDrawer
					title={"new Role"}
					btnTitle={"Role"}
					children={<AddRole drawer={true} />}
				  />
				</Form.Item>
  
				<Form.Item
				  rules={[
					{
					  required: true,
					  message: "Veuillez saisir votre Department!"
					}
				  ]}
				  label="Politique de congés"
				  name={"leavePolicyId"}
				  style={{ marginBottom: "10px" }}
				>
				  <Select
					loading={!leavePolicy}
					size="middle"
					mode="single"
					allowClear
					style={{
					  width: "100%"
					}}
					placeholder="Please select"
				  >
					{leavePolicy &&
					  leavePolicy.map((leavePolicy) => (
						<Option key={leavePolicy.id} value={leavePolicy.id}>
						  {leavePolicy.name}
						</Option>
					  ))}
				  </Select>
				</Form.Item>
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Date de prise de service"
				  rules={[
					{ required: true, message: "Veuillez saisir votre date!" }
				  ]}
				  name="designationStartDate"
				>
				  <DatePicker className="date-picker hr-staffs-date-picker" />
				</Form.Item>
				<Form.Item
				  rules={[
					{
					  required: true,
					  message: "Veuillez saisir votre Department!"
					}
				  ]}
				  label="Vacances hebdomadaires"
				  name={"weeklyHolidayId"}
				  style={{ marginBottom: "10px" }}
				>
				  <Select
					loading={!weeklyHoliday}
					size="middle"
					mode="single"
					allowClear
					style={{
					  width: "100%"
					}}
					placeholder="Please select"
				  >
					{weeklyHoliday &&
					  weeklyHoliday.map((weeklyHoliday) => (
						<Option key={weeklyHoliday.id} value={weeklyHoliday.id}>
						  {weeklyHoliday.name}
						</Option>
					  ))}
				  </Select>
				</Form.Item>
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Date de fin de la désignation"
				  name="designationEndDate"
				>
				  <DatePicker className="date-picker hr-staffs-date-picker" />
				</Form.Item>
  
				<Form.Item
				  style={{ marginBottom: "10px" }}
				  label="Date de fin du salaire"
				  name="salaryEndDate"
				>
				  <DatePicker className="date-picker hr-staffs-date-picker" />
				</Form.Item>
			  </Row> */}
  
			  <Form.Item
				style={{ marginBottom: "10px", marginTop: "10px" }}
				wrapperCol={{
				  offset: 4,
				  span: 16
				}}
			  >
				<Button
				  className="mt-5"
				  size="large"
				  onClick={() => setLoader(true)}
				  block
				  type="primary"
				  htmlType="submit"
				  //shape="round"
				  loading={loader}
				>
				  Ajouter un nouveau personnel
				</Button>
			  </Form.Item>
			</Form>
		  </div>
		</UserPrivateComponent>
	  </Fragment>
	);
  };
  
  export default AddUser;
  