import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SetLoader } from "../../redux/loadersSlice";
import { useTranslation } from 'react-i18next';
import { Select } from "antd";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
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
    // Check if there is a token in the URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      // Clear the token from the URL
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleGoogleLoginAndCallback = (e) => {
    e.preventDefault();
    const googleRedirectUrl = process.env.NODE_ENV === 'production' ? 'https://marketify-qcnh.onrender.com/auth/google' : 'http://localhost:5000/auth/google';
    window.location.href = googleRedirectUrl;
  };

  return (
    <section className="bg-white overflow-hidden scrollbar-hide" dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}>
      <>
        {/* component */}
        <div className="flex flex-col md:flex-row">
          <div className="relative overflow-hidden md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 hidden md:flex justify-around items-center">
            <div>
              <h1 className="text-white font-bold text-4xl font-sans">Marketify</h1>
              <p className="text-white mt-1">{t('A platform where you can sell and buy used stuff')}</p>
            </div>
            <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
            <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8" />
          </div>
          <div className="flex md:w-1/2 justify-center py-6 items-center bg-white">
            <div className="flex flex-col justify-center items-center bg-white">
              <form className="w-full max-w-sm bg-white px-6 md:py-16 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto" onSubmit={onsubmit} dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}>
                <h1 className="text-gray-800 font-bold text-2xl mb-1">{t('login')}</h1>
                <p className="text-sm font-normal text-gray-600 mb-7">{t('Please log in to your account')}</p>

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
                    placeholder={t('email')}
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
                  {t('login')}
                </button>

                <span className="text-sm cursor-pointer">
                  <p className="text-sm mt-4 text-center">
                    {t('Dont Have an account?')} {" "}
                    <Link to="/register" className="text-blue-500 hover:text-blue-700">
                      {t('Sign up')}
                    </Link>
                  </p>
                </span>
                <div className="flex flex-col w-full border-opacity-30 mt-2">
                  <div className="divider">OR</div>
                </div>
                <button
                  className="block w-full h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 focus:outline-none"
                  onClick={handleGoogleLoginAndCallback}
                >
                  <div className="relative flex items-center justify-center">
                    <img
                      src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
                      className="absolute left-5 w-5"
                      alt="google logo"
                    />
                    <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                      Continue with Google
                    </span>
                  </div>
                </button>
              </form>
            </div>
          </div>
          <div className="w-full flex justify-center md:justify-end p-4 md:p-6">
            <Select
              defaultValue={i18n.language}
              onChange={changeLanguage}
              className="w-full max-w-xs md:max-w-none md:w-32"
            >
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="ku">کوردی</Select.Option>
              <Select.Option value="ar">العربية</Select.Option>
            </Select>
          </div>
        </div>
        {open && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert severity="error" onClose={handleClose}>
              {alertMessage}
            </MuiAlert>
          </Snackbar>
        )}
      </>
    </section>
  );
}

export default Login;
