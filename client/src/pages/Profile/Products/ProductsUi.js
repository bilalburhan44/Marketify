import React from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { SetLoader } from "../../../redux/loadersSlice";
import { Table } from "antd";
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useProduct } from "./ProductContext";
import { DeleteProduct } from "../../../apicalls/products";
import ProductBids from "./ProductBids";

function ProductsUi() {
  const navigate = useNavigate(); // Initialize navigate
  const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();
  const [showbids, setShowBids] = React.useState(false);
  const dispatch = useDispatch();
  const handleAddProductClick = () => {
    setSelectedProduct(null)
    navigate("/products"); // Navigate to the ProductsPage when the button is clicked
  };

  React.useEffect(() => {
    getdata();
  }, [getdata]);

  const deleteproduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        Modal.success({
          content: response.message,
          okButtonProps : {className : "custom-ok-button focus:outline-none bg-blue-500 text-white"}
        })
        getdata();
      }else{
        Modal.error({
          content: response.message,
        })
      }
    } catch (error) {
      dispatch(SetLoader(false));
      Modal.error({
        content: error.message,
      })
    }
  }
  const columns = [
    {
      title : "Product",
      dataIndex : 'image',
      render : (text, record) => {
        return (
          <img
            src={record?.images?.length > 0 ? record.images[0] : " "}
           className="w-20 h-20 object-cover rounded-md"
          />
        );
      }
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title : "Added on",
      dataIndex : "createdAt",
      render : (text) => {
        return new Date(text).toLocaleString();
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            <FontAwesomeIcon icon={faTrash}
            onClick={() => deleteproduct(record._id)}
            style={{cursor:"pointer"}}

            />
            <FontAwesomeIcon icon={faEdit} 
            onClick={() => {
              setSelectedProduct(record);
              navigate("/products");
            }
            }
            style={{cursor:"pointer"}}

            />
            <span className="cursor-pointer text-blue-500 "
            onClick={() => {
              setSelectedProduct(record);
              setShowBids(true);
            }}
            >Show Bids</span>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    getdata();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2"
          onClick={ handleAddProductClick} 
        >
          Add products
        </button>
      </div>
      <Table columns={columns} dataSource={products} scroll={{ x: true }} />
      {showbids &&( 
        <ProductBids 
        setShowbidsModal={setShowBids}
        showbidsModal={showbids}
        selectedProduct={selectedProduct}
        
        />)
      }
    </div>
  );
}


export default ProductsUi;
