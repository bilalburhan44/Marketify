import React from "react";
import { Modal, Form, Input, Row, Col, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import TextArea from "antd/es/input/TextArea";
import { AddProduct, EditProduct, handleFileUpload } from "../../../apicalls/products";
import { useProduct } from "./ProductContext";
import Images from "./Images";
import { Select, Checkbox } from "antd";


const { Option } = Select;



const additionalThings = [
  {
    label: "Delivery Available",
    name: "deliveryAvailable",
  },
  {
    label: "Warranty Available",
    name: "warrantyAvailable",
  },
  {
    label: "Box Available",
    name: "boxAvailable",
  },
  {
    label: "Accessory Available",
    name: "accessoryAvailable",
  },
];

const rules = [
  {
    required: true,
    message: "Required",
  },
];


function ProductsPage() {
  const dispatch = useDispatch();
  const [file, setFile] = React.useState(null);
  const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();

  const { user } = useSelector((state) => state.users)
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));

      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
        Modal.success({
          content: "product Updated successfully",
          onOk: () => {
            navigate("/profile");
          },
          okButtonProps: { // Customize the OK button style
            className: "custom-ok-button focus:outline-none bg-blue-500 text-white", // Add custom class for styling // Apply custom styles
          },
        })
        getdata();
      } else {

        values.seller = user._id;
        values.status = "Pending";
        const addProductResponse = await AddProduct(values, file);

        Modal.success({
          content: "product added successfully",
          onOk: () => {
            navigate("/profile");
          },
          okText: "OK", // Customize the text of the OK button
          okButtonProps: { // Customize the OK button style
            className: "custom-ok-button focus:outline-none bg-blue-500 text-white", // Add custom class for styling // Apply custom styles
          },
        });
        getdata(); // Refresh product data

      }

      dispatch(SetLoader(false));
    } catch (error) {
      dispatch(SetLoader(false));

      Modal.error({
        content: "Failed to add product",
      });
    }
  };

  const navigate = useNavigate();
  const formref = React.useRef();
  React.useEffect(() => {
    if (selectedProduct) {
      formref.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  const goBack = () => {
    navigate("/profile");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">

      <Form
        layout="vertical"
        ref={formref}
        onFinish={onFinish}
        className="w-full max-w-3xl shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h1 className="text-2xl font-bold mb-4">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the product name!" }]}
          className="mb-4"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the product description!" }]}
          className="mb-4"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input the product price!" }]}
              className="mb-4"
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                <Option value="electronics">Electronics</Option>
                <Option value="fashion">Fashion</Option>
                <Option value="home">Home</Option>
                <Option value="sports">Sports</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Age"
              name="age"
              rules={[{ required: true, message: "Please input the product age!" }]}
              className="mb-4"
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        {additionalThings.map((thing, index) => {
          return (
            <Form.Item
              name={thing.name}
              valuePropName="checked"
              label={thing.label}

              key={index}
              style={{ display: 'inline-flex', alignItems: 'center', marginRight: 20 }}
              >
              
                <Input
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
                  value={thing.name}
                  type="checkbox"
                  onChange={(e) => {
                    formref.current.setFieldsValue({ [thing.name]: e.target.checked })
                  }}
                  checked={formref.current?.getFieldValue(thing.name)}
                
              />
            </Form.Item>
          )
        })

        }

        <Images selectedProduct={selectedProduct} getData={getdata} setFile={setFile} />
        <Form.Item className="flex justify-between mt-4">
          <Button onClick={() => navigate("/profile")} className="border-blue-500 text-blue-500 focus:outline-none ">
            Go Back
          </Button>
          <Button type="primary" htmlType="submit" className=" m-2 border-blue-500 bg-blue-500 focus:outline-none">
            Submit
          </Button>
        </Form.Item>
      </Form>

    </div>
  );
}

export default ProductsPage;
