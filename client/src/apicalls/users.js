import { axiosInstance } from "./axiosinstance";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react'; // Import useState from React


// Function to display error message using Material-UI components
const displayErrorMessage = (errorMessage , open , setOpen) => {
 
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  // Render the Snackbar component with the error message
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert severity="error" onClose={handleClose}>
        {errorMessage}
      </MuiAlert>
    </Snackbar>
  );
};

//Register
export const RegisterUser = async(payload) => {
  try {
    const response = await axiosInstance.post('/api/users/register', payload);
    return response.data;
  } catch (error) {
    // Display error message using Material-UI components
    displayErrorMessage(error.message);
    return error.message;
  }
};

//Login
export const LoginUser = async(payload) => {
  try {
    const response = await axiosInstance.post('/api/users/login', payload);
    return response.data;
  } catch (error) {
    // Display error message using Material-UI components
    displayErrorMessage(error.message);
    return error.message;
  }
};

//get current user
export const getCurrentUser = async() => {
  try {
    const response = await axiosInstance.get('/api/users/get-current-user');
    return response.data;
  } catch (error) {
    // Display error message using Material-UI components
  
    return error.message;
  }
};

export const getAllUsers = async() => {
  try {
    const response = await axiosInstance.get('/api/users/get-all-users');
    return response.data;
  } catch (error) {
  
    return error.message;
  }
}

export const UpdateUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/api/users/update-user-status/${id}`, { status });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

export const UpdateUserRole = async (id, role) => {
  try {
    const response = await axiosInstance.put(`/api/users/update-user-role/${id}`, { role });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

export const handleProfileUpdate = async (formData) => {
  try {
      const response = await axiosInstance.post('/api/users/update-profile', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      return response.data;
  } catch (error) {
      return error.message;
  }
}

export const VerifyUser = async(payload) => {
  try {
    const response = await axiosInstance.post('/api/users/verify', payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};