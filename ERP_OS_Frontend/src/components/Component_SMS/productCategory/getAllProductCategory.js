import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./productCategory.css";

import { Button, Dropdown, Menu, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllProductCategory } from "../../../redux/actions/productCategory/getProductCategoryAction";

function CustomTable({ list, total }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/product-category/${id}`}>{name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Créé le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["ascend", "descend"],
    },
  ];

  useEffect(() => {
    setColumnItems(menuItems);
    setColumnsToShow(columns);
  }, []);

  const colVisibilityClickHandler = (col) => {
    const ifColFound = columnsToShow.find((item) => item.key === col.key);
    if (ifColFound) {
      const filteredColumnsToShow = columnsToShow.filter(
        (item) => item.key !== col.key
      );
      setColumnsToShow(filteredColumnsToShow);
    } else {
      const foundIndex = columns.findIndex((item) => item.key === col.key);
      const foundCol = columns.find((item) => item.key === col.key);
      let updatedColumnsToShow = [...columnsToShow];
      updatedColumnsToShow.splice(foundIndex, 0, foundCol);
      setColumnsToShow(updatedColumnsToShow);
    }
  };

  const menuItems = columns.map((item) => {
    return {
      key: item.key,
      label: <span>{item.title}</span>,
    };
  });

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div className="card column-design">
      <div className="card-body">
        <div className="card-title d-flex justify-content-between">
          <h5>Liste des Catégories</h5>
          {list && (
            <div>
              <CSVLink
                data={list}
                style={{ margin: "5px" }}
                className="btn btn-dark btn-sm mb-1"
                filename="customer"
              >
                Télécharger .CSV
              </CSVLink>
            </div>
          )}
        </div>

        {list && (
          <div style={{ marginBottom: "30px" }}>
            <Dropdown
              menu={
                <Menu onClick={colVisibilityClickHandler} items={columnItems} />
              }
              placement="bottomLeft"
            >
              <Button className="column-visibility">Column Visibility</Button>
            </Dropdown>
          </div>
        )}

        <Table
          scroll={{ x: true }}
          loading={!list}
          pagination={{
            defaultPageSize: 20,
            pageSizeOptions: [10, 20, 50, 100, 200],
            showSizeChanger: true,

            onChange: (page, limit) => {
              dispatch(loadAllProductCategory({ page, limit }));
            },
          }}
          columns={columnsToShow}
          dataSource={list ? addKeys(list) : []}
        />
      </div>
    </div>
  );
}

const GetAllProductCategory = (props) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.productCategories?.list);

  useEffect(() => {
    dispatch(loadAllProductCategory({ page: 1, limit: 10 }));
  }, [dispatch]);

  // useEffect(() => {
  //   deleteHandler(list, deletedId);
  // }, [deletedId, list]);

  return <CustomTable list={list} />;
};

export default GetAllProductCategory;
