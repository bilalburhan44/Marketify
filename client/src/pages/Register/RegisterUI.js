import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { RegisterUser } from "../../apicalls/users";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';  // Added import for MuiAlert
import { SetLoader } from "../../redux/loadersSlice";
import { useDispatch } from "react-redux";
import { useEmail } from './EmailContext';



function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userStatus } = useEmail();
  const { handleLogin } = useEmail();
  const { handleStatus } = useEmail();
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const onsubmit = async (event, values) => {
    event.preventDefault();
    try {
      dispatch(SetLoader(true))
      const response = await RegisterUser(values);
      dispatch(SetLoader(false))
      if (response.success) {
        setAlertMessage(response.message);
        setOpen(true);
        handleLogin(values.email);
        handleStatus(values.status);
        navigate("/verify");
       
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      setAlertMessage(error.message);
      setOpen(true);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  }, [])
 


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <section className="bg-white">
      <>
        {/* component */}
        <div className="h-screen md:flex">
          <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
            <div>
              <h1 className="text-white font-bold text-4xl font-sans">Marketify</h1>
              <p className="text-white mt-1">
              A platform where you can sell and buy used stuff
              </p>
            </div>
            <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
          </div>
          <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
            <form className="bg-white" onSubmit={(event) =>
              onsubmit(event, {
                name: event.target.name.value,
                email: event.target.email.value,
                password: event.target.password.value,
              })
            }>
              <h1 className="text-gray-800 font-bold text-2xl mb-1">Register</h1>
              <p className="text-sm font-normal text-gray-600 mb-7">Create your account</p>
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
                type="text"
                  name="name"
                  id="name"
                  placeholder="Full name"
                  required={"true"}
                />
              </div>
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
                  placeholder="Email address"
                  required={true}
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
                />
              </div>
              <button
                type="submit"
                className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 hover:bg-indigo-700 focus:outline-none"
              >
                Sign up
              </button>
              <span className="text-sm cursor-pointer">
              <p className="text-sm mt-4 text-center">
              Already Have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700"
                href="#"
              >
                Log in
              </Link>
            </p>
              </span>
            </form>
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
}

export default Register;

