import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Tag } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";

import dayjs from "dayjs";
import BtnViewSvg from "../UI/Button/btnViewSvg";
import ViewBtn from "../Buttons/ViewBtn";
import { clearLeaveApplicationList, loadSingleLeaveHistory } from "../../../redux/rtk/features/leave/leaveSlice";
import { useParams } from "react-router-dom";
import Loader from "../../loader/loader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

function CustomTable({ list, loading }) {
  const [columnsToShow, setColumnsToShow] = useState([]);

  console.log(list);
  
  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id"
    },

    {
      id: 3,
      title: "Type de congé",
      dataIndex: "leaveType",
      key: "leaveType"
    },
    {
      id: 4,
      title: "Partir du",
      dataIndex: "leaveFrom",
      key: "leaveFrom",
      render: (leaveFrom) => dayjs(leaveFrom).format("DD-MM-YYYY")
    },
    {
      id: 5,
      title: "Jusqu'au",
      dataIndex: "leaveTo",
      key: "leaveTo",
      render: (leaveTo) => dayjs(leaveTo).format("DD-MM-YYYY")
    },
    {
      id: 6,
      title: "Durée du congé",
      dataIndex: "leaveDuration",
      key: "leaveDuration",
      render: (leaveDuration) => {
        if (leaveDuration > 1) {
          return <span>{leaveDuration} jours</span>;
        } else {
          return <span>{leaveDuration} jour</span>;
        }
      }
    },

    {
      id: 7,
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "ACCEPTED") {
          return <Tag color="green">{status.toUpperCase()}</Tag>;
        } else if (status === "REJECTED") {
          return <Tag color="red">{status.toUpperCase()}</Tag>;
        } else {
          return <Tag color="orange">{status.toUpperCase()}</Tag>;
        }
      }
    },

    {
      id: 8,
      title: "Crée le",
      dataIndex: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD-MM-YYYY")
    },

    {
      id: 9,
      title: "Action",
      key: "action",
      render: ({ id }) => (
        
        <ViewBtn
          path={`/admin/leave/${id}`}
          text="View"
          icon={<BtnViewSvg />}
        />
        
      )
    },

    // {
    //   id: 10,
    //   title: "Motif du congé",
    //   dataIndex: "reason",
    //   key: "reason"
    // }

  ];

  useEffect(() => {
    setColumnsToShow(columns);
  }, []);

  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div className="ant-card p-4 rounded mt-5">
      <div className="flex my-2 justify-between">
        <div className="w-50">
          <h4 className="text-2xl mb-2"> Mes demandes de congé</h4>
        </div>
        {list && (
          <div className="flex justify-end mr-4">
            <div className="mt-0.5">
              <CsvLinkBtn>
                <CSVLink
                  data={list}
                  className="btn btn-dark btn-sm"
                  style={{ marginTop: "5px" }}
                  filename="leave_applications"
                >
                  Télécharger CSV
                </CSVLink>
              </CsvLinkBtn>
            </div>
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
        className="text-center"
        scroll={{ x: true }}
        loading={loading}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
      />
    </div>
  );
}

const UserLeave = (props) => {
  const { id } = useParams("id");
  const dispatch = useDispatch();
  const list = useSelector((state) => state.leave.leaveHistory);
  const loading = useSelector((state) => state.leave.loading);

  useEffect(() => {
    dispatch(loadSingleLeaveHistory(id));
    return () => {
       		dispatch(clearLeaveApplicationList());
       	};
  }, [id]);

  // useEffect(() => {
	// 	dispatch(loadAttendanceByUserId(id));

	// 	return () => {
	// 		dispatch(clearAttendanceList());
	// 	};
	// }, [id]);
  // console.log(list);
  return (
    <UserPrivateComponent permission='create-leaveApplication'>
      <div className="card">
        <div className="card-body">
        {/* {!loading ? <CustomTable list={list?.singleleave} loading={loading} /> : <Loader />} */}
          <CustomTable list={list?.singleLeave} loading={loading} />
        </div>
      </div>
    </UserPrivateComponent>
  );
  
};

export default UserLeave;
