import React, { createContext, useState } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userStatus, setUserStatus] = useState('');

  const handleLogin = (email) => {
    setUserEmail(email);
  };

  const handleStatus = (status) => {
    setUserStatus(status);
  };
  
  return (
    <EmailContext.Provider value={{ userEmail, setUserEmail, handleLogin, handleStatus, userStatus, setUserStatus }}>
      {children}
    </EmailContext.Provider>
  );
};


export const useEmail = () => React.useContext(EmailContext);