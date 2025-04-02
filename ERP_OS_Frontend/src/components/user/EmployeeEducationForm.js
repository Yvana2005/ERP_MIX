import { Button, DatePicker, Form, Input, Space } from "antd";
import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const EmployeeEducationForm = ({ key, restField, remove, name }) => {
  return (
    <div>
      <Space
        key={key}
        style={{
          display: "flex",

          justifyContent: "space-between",
          marginBottom: 8
        }}
        align="baseline"
      >
        {/* <Form.Item
          {...restField}
          name={[name, "degree"]}
          rules={[
            {
              required: true,
              message: "Niveau manquant"
            }
          ]}
        >
          <Input placeholder="Niveau" />
        </Form.Item> */}
        {/* <Form.Item
          {...restField}
          name={[name, "institution"]}
          rules={[
            {
              required: true,
              message: "Etablissement manquant"
            }
          ]}
        >
          <Input placeholder="Institution" />
        </Form.Item> */}
        {/* <Form.Item
          {...restField}
          name={[name, "result"]}
          rules={[{ required: true, message: "Missing result" }]}
        >
          <Input placeholder="Resultat Obtenue" />
        </Form.Item> */}

        {/* <Form.Item
          {...restField}
          name={[name, "studyStartDate"]}
          rules={[{ required: true, message: "Missing studyStartDate" }]}
        >
          <DatePicker placeholder="Date de Début des Études" />
        </Form.Item> */}

        {/* <Form.Item
          {...restField}
          name={[name, "studyEndDate"]}
          rules={[{ required: true, message: "Missing studyEndDate" }]}
        >
          <DatePicker placeholder="Date de Fin des Études" />
        </Form.Item> */}

        {/* <Form.Item
          {...restField}
          name={[name, "fieldOfStudy"]}
          rules={[{ required: true, message: "Domaine d'études Manquant" }]}
        >
          <Input placeholder="Domaine d'études; Ordinateur" />
        </Form.Item> */}

        <Form.Item
          {...restField}
          name={[name, "degree"]}
          rules={[
            {
              required: true,
              message: "Diplôme manquant"
            }
          ]}
        >
          <Input placeholder="Dernier Diplôme" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, "fieldOfStudy"]}
          rules={[{ required: true, message: "Niveau d'études Manquant" }]}
        >
          <Input placeholder="Niveau d’étude" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, "skill"]}
          rules={[
            {
              required: true,
              message: "Compétence manquante"
            }
          ]}
        >
          <Input placeholder="Compétence(s)" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, "qualification"]}
          rules={[
            {
              required: true,
              message: "Qualification manquante"
            }
          ]}
        >
          <Input placeholder="Qualification(s)" />
        </Form.Item>

        <MinusCircleOutlined
          className="txt-color"
          style={{ fontSize: "150%" }}
          onClick={() => remove(name)}
        />
      </Space>
    </div>
  );
};

export default EmployeeEducationForm;
