import { Divider, Modal, message } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import  moment  from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DeleteNotification } from '../apicalls/notification';
import { SetLoader } from '../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import image from "./../pages/Profile/profileicon.webp"
import { useTranslation } from 'react-i18next';
function NotificationModal({
    notifications=[],
    reloadNotifications,
    showNotification,
    setShowNotification
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t , i18n } = useTranslation();
    
    const deleteNotification = async (id) => {
        try {
          dispatch(SetLoader(true));
          const response = await DeleteNotification(id);
          dispatch(SetLoader(false));
          if (response.success) {
            message.success(response.message);
            reloadNotifications();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          dispatch(SetLoader(false));
          message.error(error.message);
        }
    }
  return (
    <div>
      <Modal
      title={t('notification')}
      open={showNotification}
      onCancel={() => setShowNotification(false)}
      footer={null}
      centered
      width={700}
      dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}
      >
      <Divider />
      {notifications.length === 0 ? <span className="text-lg text-gray-400 text-center">{t('There are no notifications')}</span> :
      <div className="flex flex-col gap-2" dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}
      >
        {notifications?.map((notification) => (
            <div>
            <div className="flex justify-between items-center group block cursor-pointer" key={notification._id}>
              <div className="flex items-center flex-grow" onClick={() => {
                  navigate(notification.onClick); setShowNotification(false);}}>
                <img className="inline-block flex-shrink-0 size-[45px] rounded-full" src={notification.profilepic || image} />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{notification.title}</h3>
                  <h1 className="text-sm font-medium text-gray-700">{notification.message}</h1>
                  <h2 className='text-sm text-gray-400'>{moment(notification.createdAt).fromNow()}</h2>
                </div>
                </div>
                
              <FontAwesomeIcon icon={faTrash}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification._id);
                  
                }}
                className="cursor-pointer"
              />
              </div>
              <Divider />
            </div>
            ))}
      </div>
    }
      </Modal>
    </div>
  )
}

export default NotificationModal