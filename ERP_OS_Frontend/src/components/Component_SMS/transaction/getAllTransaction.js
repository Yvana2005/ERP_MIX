import { Button, DatePicker, Dropdown, Menu, Table } from "antd";
import "bootstrap-icons/font/bootstrap-icons.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadAllTransaction } from "../../../redux/actions/transaction/getTransactionAction";
import "./transaction.css";

function CustomTable({ list, total, startdate, enddate }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/transaction/${id}`}>{id}</Link>,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Compte débiteur",
      dataIndex: "debit",
      key: "debit",
      render: (debit) => debit?.name,
      sorter: (a, b) => a.debit.name.localeCompare(b.debit.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Compte de crédit",
      dataIndex: "credit",
      key: "credit",
      render: (credit) => credit?.name,
      sorter: (a, b) => a.credit.name.localeCompare(b.credit.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Montant",
      dataIndex: "amount",
      key: "amount",
      responsive: ["md"],
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Particuliers",
      dataIndex: "particulars",
      key: "particulars",
      sorter: (a, b) => a.particulars.localeCompare(b.particulars),
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

  const CSVlist = list?.map((i) => ({
    ...i,
    debit: i?.debit?.name,
    credit: i?.credit?.name,
  }));

  return (
    <div>
      <div className="text-end">
        {list && (
          <div>
            <CSVLink
              data={CSVlist}
              className="btn btn-dark btn-sm mb-1"
              style={{ margin: "5px" }}
              filename="transaction"
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
            <Button>Column Visibility</Button>
          </Dropdown>
        </div>
      )}
      <Table
        scroll={{ x: true }}
        loading={!list}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100, 200],
          showSizeChanger: true,
          total: total ? total : 0,

          onChange: (page, limit) => {
            dispatch(loadAllTransaction({ page, limit, startdate, enddate }));
          },
        }}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
      />
    </div>
  );
}

const GetAllTransaction = (props) => {
  const [startdate, setStartdate] = useState(moment().startOf("month"));
  const [enddate, setEnddate] = useState(moment().endOf("month"));
  const dispatch = useDispatch();
  const list = useSelector((state) => state.transactions.list);

  const total = useSelector((state) => state.transactions.total);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    dispatch(
      loadAllTransaction({
        page: 1,
        limit: 10,
        startdate: startdate,
        enddate: enddate,
      })
    );
  }, []);

  const onCalendarChange = (dates) => {
    const Newstartdate = (dates?.[0]).format("YYYY-MM-DD HH:mm");
    const Newenddate = (dates?.[1]).format("YYYY-MM-DD HH:mm");
    setStartdate(Newstartdate ? Newstartdate : startdate);
    setEnddate(Newenddate ? Newenddate : enddate);
    dispatch(
      loadAllTransaction({
        page: 1,
        limit: 10,
        startdate: Newstartdate,
        enddate: Newenddate,
      })
    );
  };

  return (
    <div className="card card-custom">
      <div className="card-body">
        <div className="card-title d-sm-flex justify-content-between">
          <h5 className="">
            <span>Historique des transactions</span>
          </h5>
          <div>
            <RangePicker
              onCalendarChange={onCalendarChange}
              defaultValue={[
                moment().startOf("month"),
                moment().endOf("month"),
              ]}
            />
          </div>
        </div>
        <CustomTable
          list={list}
          total={total?._count?.id}
          startdate={startdate}
          enddate={enddate}
        />
      </div>
    </div>
  );
};

export default GetAllTransaction;
