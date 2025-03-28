import { Button, Card, Popover, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";

import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import { loadSingleDepartment } from "./departmentApis";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { CSVLink } from "react-csv";
import ViewBtn from "../Buttons/ViewBtn";
import DepartmentEditPopup from "../UI/PopUp/DepartmentEditPopup";
import { deleteDepartment } from "./departmentApis"; 
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

//PopUp

const CustomTable = ({ list }) => {
  const [columnsToShow, setColumnsToShow] = useState([]);

  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id"
    },

    {
      id: 2,
      title: " Nom",
      key: "firstName",
      render: ({ firstName, lastName }) => firstName + " " + lastName
    },

    {
      id: 6,
      title: "Nom d'utilisateur",
      dataIndex: "userName",
      key: "userName"
    },

    {
      id: 5,
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role?.name
    },

    {
      id: 6,
      title: "Désignation",
      dataIndex: "designationHistory",
      key: "designationHistory",
      render: (designationHistory) =>
        designationHistory[0]?.designation?.name || "N/A"
    },

    {
      id: 4,
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id) => (
        <UserPrivateComponent permission={"readSingle-user"}>
          <ViewBtn path={`/admin/hr/staffs/${id}/`} />
        </UserPrivateComponent>
      )
    }
  ];

  useEffect(() => {
    setColumnsToShow(columns);
  }, []);

  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div>
      <div className="text-center my-2 flex justify-between">
        <h5 className="department-list-title text-color-2 text-xl mb-2">
          Liste des employés
        </h5>

        {list && (
          <div>
            <CsvLinkBtn>
              <CSVLink data={list} filename="département_utilisateur">
                Télécharger CSV
              </CSVLink>
            </CsvLinkBtn>
          </div>
        )}
      </div>
      {list && (
        <div style={{ marginBottom: "30px" }}>
          <ColVisibilityDropdown
            options={columns}
            columns={columns}
            columnsToShowHandler={columnsToShowHandler}
          />
        </div>
      )}
      <Table
        loading={!list}
        columns={columnsToShow}
        dataSource={addKeys(list)}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 720 }}
      />
    </div>
  );
};

const DetailDepartment = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const [department, setDepartment] = useState(null);
  //const [departments, setDepartments] = useState(null);
  
  //Delete Supplier
  

  // const onDelete = () => {
  //   try {
  //     dispatch(deleteDepartment(id));

  //     setVisible(false);
  //     toast.warning(`User Name : ${department.name} is removed `);
  //     return navigate("/admin/department");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const onDelete = () => {
  //   try {
  //     dispatch(deleteDepartment(id));
  //     setVisible(true);
  //     toast.warning(`department Name : ${department.name} is removed `);
  //     navigate("/admin/department");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  // Delete Supplier PopUp
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    loadSingleDepartment(id).then((d) => setDepartment(d.data));
  }, [id]);

  const onDelete = async () => {
    if (!department || !department.id) {
      return toast.error("Le département est introuvable !");
    }
  
    try {
      const confirmDelete = window.confirm(
        `Voulez-vous vraiment supprimer le département : ${department.name} ?`
      );
  
      if (!confirmDelete) return;
  
      // Utilisation de la fonction API `deleteDepartment`
      const response = await deleteDepartment(department.id);
      console.log("Réponse API suppression :", response);
  
      if (response.message === "success") {
        toast.success(`Le département ${department.name} a été supprimé.`); 
        
        navigate("/admin/department");
      } else {
        toast.error("Échec de la suppression du département !");
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression !");
    }
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div>
      <PageTitle title=" Retour  " />

      <UserPrivateComponent permission={"readSingle-department"}>
        <Card className="mr-top mt-5">
          {department ? (
            <Fragment key={department.id}>
              <div>
                <div className="flex justify-between ">
                  <h3 className={"text-xl"}>
                    ID : {department.id} | {department.name}
                  </h3>
                  <UserPrivateComponent permission={"update-department"}>
                    <div className="flex justify-end">
                      <DepartmentEditPopup data={department} />
                      <Popover
                        className="m-2"
                        // content={
                          
                        //     <Button disabled={false} type="primary" danger onClick={onDelete}>
                        //       Oui s'il vous plait !
                        //     </Button>
                          
                        // }
                        // title="Etes-vous sûr que vous voulez supprimer ?"
                        // trigger="click"
                        // visible={visible}
                        // onVisibleChange={handleVisibleChange}
                      >
                        <button disabled={false} onClick={onDelete}>
                          <BtnDeleteSvg size={30} />
                        </button>
                      </Popover>
                    </div>
                  </UserPrivateComponent>
                </div>
                <CustomTable list={department.user} />
              </div>
            </Fragment>
          ) : (
            <Loader />
          )}
        </Card>
      </UserPrivateComponent>
    </div>
  );
};

export default DetailDepartment;
