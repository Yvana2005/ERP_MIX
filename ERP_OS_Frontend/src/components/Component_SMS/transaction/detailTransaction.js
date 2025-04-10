import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Popover, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";

import { toast } from "react-toastify";
import "./transaction.css";

import moment from "moment";
import { loadTransaction } from "../../../redux/actions/transaction/detailTransactionAction";

//PopUp

const DetailTransaction = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.transactions.transaction);

  //Delete Supplier
  const onDelete = () => {
    try {
      // dispatch(deleteSupplierPayment(id));

      setVisible(false);
      toast.warning(`La Transaction : ${payment.id} est supprimée `);
      return navigate("/payment");
    } catch (error) {
      console.log(error.message);
    }
  };
  // Delete Supplier PopUp
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadTransaction(id));
  }, [id]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  return (
    <div>
      <PageTitle title=" Retour " subtitle={`Paiement ${id} information`} />

      <div className="mr-top">
        {payment ? (
          <Fragment key={payment.id}>
            <Card bordered={false} className="card-custom">
              <div className="card-header d-flex justify-content-between mb-2" style={{ padding: 0 }}>
                <h5>
                  <i className="bi bi-person-lines-fill"></i>
                  <span className="mr-left">
                    ID : {payment.id} | {payment.date}
                  </span>
                </h5>
                <div className="text-end">
                  <Popover
                    content={
                      <a onClick={onDelete}>
                        <Button type="primary" danger>
                          Oui !
                        </Button>
                      </a>
                    }
                    title="Êtes-vous sûr de vouloir supprimer ?"
                    trigger="click"
                    open={visible}
                    onOpenChange={handleVisibleChange}
                  >
                    <Button
                      type="danger"
                      shape="round"
                      icon={<DeleteOutlined />}
                    >Supprimer</Button>
                  </Popover>
                </div>
              </div>
              <div>
                <p>
                  <Typography.Text className="font-semibold">
                    Date :
                  </Typography.Text>{" "}
                  {moment(payment.date).format("DD/MM/YY HH:mm")}
                </p>

                <p>
                  <Typography.Text strong>Quantité :</Typography.Text>{" "}
                  {payment.amount}
                </p>

                <p>
                  <Typography.Text strong>Particulier :</Typography.Text>{" "}
                  {payment.particulars}
                </p>
                <p>
                  <Typography.Text strong>Type :</Typography.Text>{" "}
                  {payment.type}
                </p>
              </div>
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailTransaction;
