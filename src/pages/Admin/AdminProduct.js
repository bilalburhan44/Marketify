import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Table } from "antd";
import { useDispatch } from 'react-redux';
import { useProduct } from "./../Profile/Products/ProductContext";
import { SetLoader } from "../../redux/loadersSlice";
import { DeleteProduct, UpdateProductStatus } from "../../apicalls/products";
import { message } from 'antd';

function ProductsUi() {
  const navigate = useNavigate(); // Initialize navigate
  const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();
  
  const dispatch = useDispatch();
  

  React.useEffect(() => {
    getdata(null);
  }, []);




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

  const statusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateProductStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getdata();
      }
      else {
        message.error(response.message);
      }
    }
    catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
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
        title: "Product",
        dataIndex: "name",
      },
      {
        title: "seller",
        dataIndex: "name",
        render: (text, record) => {
          return record.seller.name
        }
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
        const {status , _id} = record
        return (
          <div className="flex gap-3"> 
          {status === "Pending" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "Approved")}
          >Approve</span>}
          {status === "Pending" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "Rejected")}
          >Reject</span>}
          {status === "Approved" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "Blocked")}
          >Block</span>}
          {status === "Blocked" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "Approved")}
          >Unblock</span>}
          {status === "Blocked" && <span className = "underline cursor-pointer"
          onClick={() => deleteproduct(_id )}
          >Delete</span>}
          {status === "Rejected" && <span className = "underline cursor-pointer"
          onClick={() => deleteproduct(_id )}
          >Delete</span>}
          </div>
        )
      }
    },
  ];


  return (
    <div>
      <Table columns={columns} dataSource={products} scroll={{ x: true }} />
    </div>
  );
}


export default ProductsUi;
