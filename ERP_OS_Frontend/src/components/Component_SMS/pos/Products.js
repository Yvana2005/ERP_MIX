import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, InputNumber, Row } from "antd";
import "./products.css";

export default function Products({
	allProducts,
	formData,
	setData,
	updateFormData,
	selectedProds,
	handleSelectedProdsQty,
	handleDeleteProd,
	handleSelectedProdsUnitPrice,
}) {
	return (
		<div className='products-container-wrapper'>
			<div className='products-container'>
				<Row gutter={[16]}>
					<Col span={2}>
						<div className='font-weight-bold border-b'>No</div>
					</Col>
					<Col span={5}>
						<div className='font-weight-bold border-b'>Produit</div>
					</Col>
					<Col span={3}>
						<div className='font-weight-bold border-b'>U.M</div>
					</Col>
					<Col xs={6} sm={6} md={6} lg={4} xl={4}>
						<div className='font-weight-bold'>Quantité </div>
					</Col>
					<Col xs={8} sm={8} md={6} lg={5} xl={5}>
						<div className='font-weight-bold'>Prix unitaire</div>
					</Col>
					<Col span={3}>
						<div className='font-weight-bold'>Total</div>
					</Col>
					<Col span={3}>
						<div></div>
					</Col>
				</Row>

				<hr style={{ backgroundColor: "black" }} />

				<Form.List name='saleInvoiceProduct'>
					{(fields, { add, remove }) => (
						<>
							{selectedProds.map(
								(
									{
										id,
										name,
										sale_price,
										selectedQty,
										unit_type,
										unit_measurement,
										...restField
									},
									index
								) => (
									<Row gutter={[16]} key={id} style={{ margin: "20px 0" }}>
										<Col span={2}>
											<Form.Item {...restField} name={[name, "product_id"]}>
												{index + 1}
											</Form.Item>
										</Col>
										<Col span={5}>
											<Form.Item {...restField} name={[name, "product_id"]}>
												{name}
											</Form.Item>
										</Col>
										<Col span={3}>
											<Form.Item>
												<div className='font-weight-bold'>
													{unit_measurement ? unit_measurement : 0} {unit_type}
												</div>
											</Form.Item>
										</Col>
										<Col xs={6} sm={6} md={6} lg={4} xl={4}>
											<Form.Item
												{...restField}
												name={[name, "product_quantity"]}>
												<InputNumber
													style={{ width: "100%" }}
													placeholder='Quantité de produit'
													onChange={(qty) => handleSelectedProdsQty(id, qty)}
													defaultValue={selectedQty}
													min={0}
												/>
											</Form.Item>
										</Col>
										<Col xs={8} sm={8} md={8} lg={5} xl={5}>
											<Form.Item
												{...restField}
												name={[name, "product_sale_price"]}>
												<InputNumber
													style={{ width: "100%" }}
													placeholder='Prix unitaire du produit'
													onChange={(price) =>
														handleSelectedProdsUnitPrice(id, price)
													}
													defaultValue={sale_price}
													min={0}
													disabled
												/>
											</Form.Item>
										</Col>
										<Col span={3}>
											<Form.Item>
												<div className='font-weight-bold'>
													{selectedQty * sale_price}
												</div>
											</Form.Item>
										</Col>
										<Col span={3}>
											<Form.Item>
												<Button
													shape='circle'
													icon={<DeleteOutlined />}
													onClick={() => {
														handleDeleteProd(id);
														// updateFormData();
													}}></Button>
											</Form.Item>
										</Col>
									</Row>
								)
							)}
						</>
					)}
				</Form.List>
			</div>
		</div>
	);
}

