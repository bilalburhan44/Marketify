import React, { useState } from "react";
import { VerifyUser } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useEmail } from './EmailContext';
import { Input, Button , message } from 'antd';

function Verification() {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const { userEmail } = useEmail();
    const { userStatus } = useEmail();
    React.useEffect(()=>{
        if(userStatus === "active"){
            navigate("/")
        }
    },[])
    React.useEffect(()=>{
        if(!userStatus || userStatus === "Blocked"){
            navigate("/register")
        }
    },[])
    

    const handleVerification = async () => {
        try {
            const response = await VerifyUser({ email: userEmail, verificationCode });

            if (response.success) {
                message.success(response.message);
                navigate("/login");
            } else {
                message.error(response.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center">Enter Verification Code</h2>
          <form>
            <div className="mb-4">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Verification Code"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                onClick={handleVerification}
                className="w-24 text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Verification;