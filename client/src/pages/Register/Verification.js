import React, { useState } from "react";
import { VerifyUser } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useEmail } from './EmailContext';
import { Input, Button , message , Select } from 'antd';
import { useTranslation } from 'react-i18next';

function Verification() {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const { userEmail } = useEmail();
    const { userStatus } = useEmail();
    const { t , i18n } = useTranslation();
    React.useEffect(()=>{
        if(userStatus === "active"){
            navigate("/")
        }
    },[])
    const changeLanguage = (language) => {
      i18n.changeLanguage(language);
    };
    React.useEffect(()=>{
        if( userStatus === "Blocked"){
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
        <div className="flex justify-center items-center h-screen bg-gray-100" dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('Enter Verification Code')}</h2>
          <form>
            <div className="mb-4">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t('Verification Code')}
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                onClick={handleVerification}
                className="w-24 text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                {t('Verify')}
              </Button>
            </div>
          </form>
          <Select defaultValue={i18n.language} onChange={changeLanguage}>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="ku">کوردی</Select.Option>
                <Select.Option value="ar">العربية</Select.Option>
              </Select>
        </div>
      </div>
    );
}

export default Verification;