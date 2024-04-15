import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SetLoader } from "../../redux/loadersSlice";


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onsubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(SetLoader(true));
      const response = await LoginUser({ email, password });
      dispatch(SetLoader(false));
      if (response.success) {
        setAlertMessage(response.message);
        setOpen(true);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setOpen(true);
      dispatch(SetLoader(false));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <section className="bg-white overflow-hidden scrollbar-hide">
      <>
        {/* component */}
        <div className="flex flex-col md:flex-row">
        <div className="relative overflow-hidden md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 hidden md:flex justify-around items-center">
        <div>
        <h1 className="text-white font-bold text-4xl font-sans">Marketify</h1>
          <p className="text-white mt-1">A platform where you can sell and buy used stuff</p>
            </div>
            <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
          </div>
          <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
          <div className="flex justify-center py-10 items-center bg-white">
          <form className="w-full  max-w-sm bg-white px-6 py-10 md:py-16 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto scrollbar-hide overflow-hidden" onSubmit={onsubmit}>
            <h1 className="text-gray-800 font-bold text-2xl mb-1">Log in</h1>
            <p className="text-sm font-normal text-gray-600 mb-7">Please log in to your account</p>

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                className="w-full py-2 px-3 rounded-lg text-gray-700 leading-tight focus:outline-none"
                type="email"
                  name="email"
                  id="email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                className="w-full py-2 px-3 rounded-lg text-gray-700 leading-tight focus:outline-none"
                type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
              type="submit"
              className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 hover:bg-indigo-700 focus:outline-none"
            >
              Log in
            </button>
            <span className="text-sm cursor-pointer">
            <p className="text-sm mt-4 text-center">
            Don't Have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Sign up
            </Link>
          </p>
            </span>
            </form>
          </div>
          </div>
        </div>
        {open && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert
              severity="error"
              onClose={handleClose}
            >
              {alertMessage}
            </MuiAlert>
          </Snackbar>
        )}
      </>

    </section>
  );
};


export default Login;