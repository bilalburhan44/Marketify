import React from "react";
import { Table } from "antd";
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import { message } from 'antd';
import { UpdateUserStatus, getAllUsers } from "../../apicalls/users";

function Users() {
// Initialize navigate
  //const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();
  const [users , setUsers] = React.useState([]);
  const dispatch = useDispatch();
  

  const getdata = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getAllUsers(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
      }catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);

    }
    }
  

  const statusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, status);
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
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Role",
        dataIndex: "role",
      },
      {
        title: "Created At",
         dataIndex: "createdAt",
         render: (text) => {
          return new Date(text).toLocaleString();
        }
      },
      {
        title: "Status",
        dataIndex: "status",
      },
      {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const {status , _id} = record
        return (
          <div className="flex gap-3"> 
          {status === "active" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "Blocked")}
          >Block</span>}
          {status === "Blocked" && <span className = "underline cursor-pointer"
          onClick={() => statusUpdate(_id, "active")}
          >Unblock</span>}
          </div>
        )
      }
    },
  ];

  React.useEffect(() => {
    getdata();
  },[])


  return (
    <div>
      <Table columns={columns} dataSource={users} scroll={{ x: true }} />
    </div>
  );
}


export default Users;
