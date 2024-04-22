import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import logo from "./logo.png";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { setUser } from "../redux/usersSlice";
import NotificationModal from "./NotificationModal";
import { GetAllNotification, ReadNotifications } from "../apicalls/notification";
import { message } from "antd";
import image from "./../pages/Profile/profileicon.webp"
import Footer from "./Footer";
import { useEmail } from "../pages/Register/EmailContext";

function ProtectedRoutes({ children }) {
  const { user } = useSelector((state) => state.users);
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [notifications = [], setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false)
  const [profilePic, setProfilePic] = useState(user?.profilepic || image);
  const { userStatus } = useEmail();
  // Use optional chaining to handle null user
  useEffect(() => {
    setProfilePic(user?.profilepic || image); // Update profile picture when user changes
  }, [user]);

  useEffect(() => {
    if (userStatus === "pending") {
      navigate("/verify")
    }
  }, [])

  const validateuser = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getCurrentUser();
      dispatch(SetLoader(false));

      if (response.success) {
        dispatch(setUser(response.data));
        setProfilePic(response.data.profilepic || image);
      } else {
        setAlertMessage(response.message); // Set the error message
        setOpen(true); // Show the Snackbar
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
    }
  };
  const getNotification = async () => {
    try {

      const response = await GetAllNotification();

      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {

      message.error(error.message);
    }
  }
  const readNotification = async () => {
    try {

      const response = await ReadNotifications();

      if (response.success) {
        getNotification()
      } else {
        throw new Error(response.message);
      }
    } catch (error) {

      message.error(error.message);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateuser();
      getNotification();
    } else {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    if (user) {
      // Update user state
      setUser(user);
    }
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null)); // Clear user state
    navigate("/login");
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/${item}`);
  };
  return (
    user && (
      <div>
        <div className="navbar bg-base-100 flex justify-between ">
          <div className="flex justify-center items-center">
            <img className="w-28 cursor-pointer" src={logo} onClick={() => navigate("/")} />
            <div class="text-gray-500 order-3 w-full md:w-auto md:order-2">
              <ul class="flex font-semibold justify-between gap-3">
                <li class={`md:px-4 md:py-2 cursor-pointer hover:text-indigo-400 ${activeItem === '' ? 'text-indigo-500' : 'text-gray-500'}`} onClick={() => handleItemClick('')}>Dashboard</li>
                <li class={`md:px-4 md:py-2 cursor-pointer hover:text-indigo-400 ${activeItem === 'user-product' ? 'text-indigo-500' : 'text-gray-500'}`} onClick={() => handleItemClick('user-product')}>Products</li>
                <li class={`md:px-4 md:py-2 cursor-pointer hover:text-indigo-400 ${activeItem === 'about' ? 'text-indigo-500' : 'text-gray-500'}`} onClick={() => handleItemClick('about')}>About</li>
              </ul>
            </div>

          </div>

          <div className="flex-none align-items-center gap-4 md:w-auto">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                <div className="w-24 rounded-full">
                  <img src={profilePic || image} />
                  {notifications?.filter((notification) => !notification.read).length > 0 && (
                    <span className="absolute top-1 end-1 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                      {notifications?.filter((notification) => !notification.read).length}
                    </span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>Signed in As {user.email}</li>
                <li>
                  <a className="justify-between"
                    onClick={() => { if (user.role === "admin") { navigate("/admin") } else { navigate("/profile") } }}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a className="justify-between"
                    onClick={() => {
                      readNotification();
                      setShowNotification(true)
                    }}
                  >
                    Notifications
                    {notifications?.filter((notification) => !notification.read).length > 0 && (
                      <span className="absolute top-3 end-3 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                        {notifications?.filter((notification) => !notification.read).length}
                      </span>
                    )}
                  </a>
                </li>

                <li><a
                  onClick={handleLogout}
                >Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
              {alertMessage}
            </MuiAlert>
          </Snackbar>
          {children}
          {<NotificationModal
            notifications={notifications}
            reloadNotifications={setNotifications}
            showNotification={showNotification}
            setShowNotification={setShowNotification}
            open={showNotification}
          />}
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    )
  );
}

export default ProtectedRoutes;
