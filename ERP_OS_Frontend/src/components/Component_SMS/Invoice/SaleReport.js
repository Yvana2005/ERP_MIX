import { Button } from "antd";
import moment from "moment";
import React, { forwardRef, Fragment, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import getSetting from "../../../api/getSettings";

import "./saleReport.module.css";

const PrintToPdf = forwardRef(
  ({ data, settingData, date, user, total }, ref) => {
    // make the sum of all the discount in the data array
    const totalDiscount = data?.reduce((acc, item) => {
      return acc + item.discount;
    }, 0);

    return (
      <Fragment>
        <div ref={ref} className="wrapper">
          <div className="box2">
            <h1>{settingData?.company_name}</h1>
            <h3>{settingData?.tag_line}</h3>
            <p>{settingData?.address}</p>
            <p>{settingData?.phone}</p>
            <p>Email: {settingData?.email}</p>
            <p>Site Web: {settingData?.website}</p>
          </div>
          <div class="box4">
            <hr class="hr1" />
            <h3 class="center">RAPPORT SUR LES COMMANDES</h3>
            <hr class="hr1" />
          </div>

          <div class="box5">
            <table class="table2">
              <tr>
                <th>Type</th>
                <td>Toute</td>
              </tr>
              <tr>
                <th>Vendeur</th>
                <td>{user ? data[0]?.user?.username : "All"} </td>
              </tr>
            </table>
          </div>

          <div class="box6">
            <table class="table2">
              <tr>
                <th>À partir de la date</th>
                <td>{date?.startdate}</td>
              </tr>
              <tr>
                <th>À ce jour</th>
                <td>{date?.enddate}</td>
              </tr>
            </table>
          </div>

          <div class="box7">
            <table class="table1">
              <thead>
                <th>Date</th>
                <th>Facture</th>
                <th>Personnel</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>U.M</th>
                <th>Type d'unité</th>
                <th>Total</th>
                <th>S Total</th>
                <th>Remise</th>
                <th>G Total</th>
                <th>Payé</th>
                <th>Montant Du</th>
              </thead>
              <tbody>
                {data &&
                  data?.map((i) => (
                    <tr>
                      <td>{moment(i.created_at).format("DD/MM/YY HH:mm")}</td>
                      <td>
                        <p>{i.id}</p>
                      </td>
                      <td>{i.userCreator ? i.userCreator.username : "N/A"}</td>
                      <td>{i.customer.username}</td>
                      <td>
                        {i.saleInvoiceProduct.map((s) => (
                          <p>{s.product.name}</p>
                        ))}
                      </td>
                      <td>
                        {i.saleInvoiceProduct.map((s) => (
                          <p>{s.product_quantity}</p>
                        ))}
                      </td>
                      <td>
                        {i.saleInvoiceProduct.map((s) => (
                          <p>{s.product.unit_measurement}</p>
                        ))}
                      </td>
                      <td>
                        {i.saleInvoiceProduct.map((s) => (
                          <p>{s.product.unit_type}</p>
                        ))}
                      </td>
                      <td>
                        {i.saleInvoiceProduct.map((s) => (
                          <p>{s.product_quantity * s.product.sale_price}</p>
                        ))}
                      </td>
                      <td>{i.total_amount}</td>
                      <td>{i.discount}</td>
                      <td>{i.total_amount - i.discount}</td>
                      <td>{i.paid_amount}</td>
                      <td>{i.due_amount}</td>
                    </tr>
                  ))}

                <tr className="font-weight-bold">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{total?.total_unit_quantity}</td>
                  <td>{total?.total_unit_measurement}</td>
                  <td></td>
                  <td></td>
                  <td>{total?.total_amount}</td>
                  <td>{totalDiscount}</td>
                  <td>{total?.total_amount - totalDiscount}</td>
                  <td>{total?.paid_amount}</td>
                  <td>{total?.due_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="box12">
            <hr />
            <p>Powered by DTA INNO | Contact: +(XXX) XXX-XXX-XXX</p>
          </div>
        </div>
      </Fragment>
    );
  }
);

const SaleReportPrint = ({ data, date, user, total }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const [settingData, setsettingData] = useState(null);
  useEffect(() => {
    getSetting().then((data) => setsettingData(data.result));
  }, []);

  return (
    <div>
      {data && (
        <div className="hidden">
          <PrintToPdf
            ref={componentRef}
            data={data}
            settingData={settingData}
            date={date}
            user={user}
            total={total}
          />
        </div>
      )}
      {settingData && (
        <button
          className="btn btn-primary btn-sm mb-1 button-size"
          onClick={handlePrint}
        >
          Imprimer PDF
        </button>
      )}
    </div>
  );
};

export default SaleReportPrint;
