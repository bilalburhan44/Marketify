import React from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import { message } from 'antd';
import { UpdateUserStatus, getAllUsers, UpdateUserRole } from "../../apicalls/users";

function Users() {
// Initialize navigate
  //const { products, selectedProduct, setSelectedProduct, getdata } = useProduct();
  const [users , setUsers] = React.useState([]);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.users)

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

  const roleUpdate = async (id, role) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserRole(id, role);
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
        render: (role) => {
          return  <div className="badge badge-primary">{role}</div>
        }
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
        const {status , _id, role} = record
        return (
          <div className="flex gap-3"> 
          
          {user.role === 'moderator' &&
           (role === 'moderator' || role === 'admin')  ? "" :  
           user.role === 'admin' && 
           ( role === 'admin') ? "" :
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
    {user.role === "admin" && <li> {role === "user" && <span 
    onClick={() => roleUpdate(_id, "moderator")}
    >Make Moderator</span>}
    {role === "moderator" && <span 
    onClick={() => roleUpdate(_id, "user")}
    >Remove As Moderator</span>}</li>}
    <li> {status === "Blocked" && <span 
    onClick={() => statusUpdate(_id, "active")}
    >Unblock</span>}
    {status === "active" && <span className="bg-red-400"
    onClick={() => statusUpdate(_id, "Blocked")}
    >Block</span>}
   </li>
  </ul>
</div> }
          
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
