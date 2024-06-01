import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Table } from "antd";
import { useDispatch } from 'react-redux';
import { useProduct } from "./../Profile/Products/ProductContext";
import { SetLoader } from "../../redux/loadersSlice";
import { DeleteProduct, GetProducts, UpdateProductStatus } from "../../apicalls/products";
import { message } from 'antd';

function ProductsUi() {
  const navigate = useNavigate(); // Initialize navigate
  const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();
  const [product , setProducts] = React.useState([]);
  const dispatch = useDispatch();
  
  const getproducts = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      } else {
        message.error(response.message);
      }
      }catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);

    }
    }

  React.useEffect(() => {
    getproducts();
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
        getproducts();
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
        getproducts();
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
      render: (status) => {
        let statusClass = "";
        if (status === "Rejected") {
          statusClass = "badge-error"; // Red background for 'Rejected'
        } else if (status === "Approved") {
          statusClass = "badge-success"; // Green background for 'Approved'
        } else {
          statusClass = "badge-warning"; // Default blue background for other statuses
        }
    
        return <div className={`badge ${statusClass}`}>{status}</div>;
      }
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => {
        let categoryClass = "";
        if (category === "fashion") {
          categoryClass = "badge-secondary badge-outline"; // Red background for 'Rejected'
        } else if (category === "sports") {
          categoryClass = "badge-accent badge-outline"; // Green background for 'Approved'
        } else if (category === "electronics") {
          categoryClass = "badge-primary badge-outline"; // Default blue background for other statuses
        } else{
          categoryClass = "badge-warning badge-outline"; // Default blue background for other statuses
        }
    
        return <div className={`badge ${categoryClass}`}>{category}</div>;
        }
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
          <div className="dropdown dropdown-bottom">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "#9c9c9c" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-full w-full"
>
  <rect
    width={4}
    height={4}
    x={0}
    y={0}
    rx={30}
    fill="transparent"
    stroke="transparent"
    strokeWidth={0}
    strokeOpacity="100%"
    paintOrder="stroke"
  />
  <svg
    width="256px"
    height="256px"
    viewBox="0 0 16 16"
    fill="#9c9c9c"
    x={128}
    y={128}
    role="img"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#9c9c9c">
      <path
        fill="currentColor"
        d="M3 9.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z"
      />
    </g>
  </svg>
</svg>

          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    
     <li> {status === "Pending" && <span className = "bg-green-400"
          onClick={() => statusUpdate(_id, "Approved")}
          >Approve</span>}
          {status === "Approved" && <span 
          onClick={() => statusUpdate(_id, "Hidden")}
          >Hide</span>}
          </li>
     <li> {status === "Pending" && <span className = "bg-red-400"
          onClick={() => statusUpdate(_id, "Rejected")}
          >Reject</span>}
          {status === "Hidden" && <span
          onClick={() => statusUpdate(_id, "Approved")}
          >Unhide</span>}
          </li>
    {status === 'Rejected' && <li> 
    <span className = "bg-red-400"
          onClick={() => deleteproduct(_id )}
          >Delete</span>
   </li>}
    {status === 'Approved' && <li> 
    <span className = "bg-red-400"
          onClick={() => deleteproduct(_id )}
          >Delete</span>
   </li>}
  </ul>
</div> 
          </div>
        )
      }
    },
  ];

 


  return (
    <div>
      <Table columns={columns} dataSource={product} scroll={{ x: true }} />
    </div>
  );
}


export default ProductsUi;
