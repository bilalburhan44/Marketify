import React, { useRef } from 'react'
import image from "./profileicon.webp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, handleProfileUpdate } from '../../apicalls/users';
import { message , Button } from 'antd';
import { SetLoader } from '../../redux/loadersSlice';
import { useTranslation } from 'react-i18next';


function ProfilePic() {
  const { user } = useSelector((state) => state.users);
  const { t, i18n } = useTranslation();
  const [profilePic, setProfilePic] = React.useState(user.profilepic || image); // State to store profile picture URL
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showButtons, setShowButtons] = React.useState(false); // State to control button visibility
  const dispatch = useDispatch()

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setShowButtons(true);
  };
 
  const handleUpload = async() => {
    try {
      dispatch(SetLoader(true))
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append("user_id", user._id);
      const response = await handleProfileUpdate(formData);
      dispatch(SetLoader(false));
     

      if (response.success) {
        message.success(response.message);
        setProfilePic(URL.createObjectURL(selectedFile));
        setSelectedFile(null)
        setShowButtons(false);
      } else {
        message.error(t('Upload failed. Please try again.'));
      }

    } catch (error) {
      dispatch(SetLoader(false));
      message.error(t('An unexpected error occurred. Please try again later.'));
    }

  };
   const handleCancel = () => {
    setSelectedFile(null);
    setShowButtons(false); // Hide buttons when canceling
  };
  
  return (
    <section dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}>
      <div className="w-80 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-lg mt-16">
        <div className="px-6">
        <div className="flex flex-wrap justify-center">
          <div className="w-full h-60 px-4 flex justify-center">
            <div className="relative">
              <img
                alt="..."
                src={profilePic ? profilePic : image}
                className="shadow-xl mt-12 border-none max-w-150-px object-cover rounded-full" // Apply rounded corners for circular image
                style={{ objectFit: 'cover', width: '150px', height: '150px' }}
              />
            </div>
          </div>
        </div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold leading-normal  text-blueGray-700 ">
                {user?.name}
              </h3>
              <div>
              <label htmlFor="file-upload" className="text-sm leading-normal mt-2 text-blue-600 cursor-pointer items-center">
              <FontAwesomeIcon icon={faEdit} /> {t('Change avatar')}
            </label>
            <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          </div>
          {showButtons && (
            <span className='mt-2'>
              <Button type='default' className="m-2 focus:outline-none" onClick={handleCancel}>{t('cancel')}</Button>
              <Button type='default' className="m-2 focus:outline-none bg-blue-500 text-white" onClick={handleUpload}>{t('Upload')}</Button>
            </span>
          )}
            </div>
          </div>
        </div>
      </div>

    </section>

  )
}

export default ProfilePic