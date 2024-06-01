import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { CreateBid } from '../../apicalls/products';
import { AddNotification } from '../../apicalls/notification';
import { useTranslation } from 'react-i18next';

function BidModal(
  {  showbidModal,
    setShowbidModal,
    product,
    getdata}
) {
    const formRef = React.useRef();
    const { user } = useSelector((state) => state.users);
    const { t , i18n } = useTranslation();
    const rules = [{ required: true, message: 'Required' }];
    const dispatch = useDispatch()
    const onFinish = async (values) => {
        try {
            
            dispatch(SetLoader(true));
            const response = await CreateBid({
                ...values,
                product: product._id,
                seller : product.seller._id,
                buyer : user._id
            });
            if (response.success) {
                message.success(response.message);
                //send notification
                await AddNotification ({
                    title : "New Bid Placed",
                    message: `${t('user placed a bid on your product with amount bidAmount', { user: user.name, product: product.name, bidAmount: values.bidAmount })}`,                    user : product.seller._id,
                    onClick : `/profile`,
                    profilepic : user.profilepic,
                    read : false
                })
                getdata();
                setShowbidModal(false);
            }else{
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
            dispatch(SetLoader(false));
        }
    }
    return (
        <Modal onCancel={() => setShowbidModal(false)}
         open={showbidModal} 
         centered title={t("Place Bid")} // Customize the OK button style
         className=' custom-ok-button focus:outline-none bg-blue-500 text-white'
         dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}
         onOk={()=>{
            formRef.current.submit();
            
         }
        }
        okText={t("Place Bid")}
         cancelText={t("Cancel")}
         okButtonProps={{className: "custom-ok-button focus:outline-none bg-blue-500 text-white"}}
        
         >
            <div className='flex flex-col gap-2' dir={i18n.language === 'ar' || i18n.language === 'ku' ? 'rtl' : 'ltr'}>
            <Form layout='vertical' ref={formRef} onFinish={onFinish}>
                <Form.Item name="bidAmount" label={t("bid Amount")} rules={rules}>
                    <Input />
                </Form.Item>
                <Form.Item name="message" label={t("Message")} rules={rules}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="phone" label={t("phone")} rules={rules}>
                    <Input type="number" />
                </Form.Item>

            </Form>
            </div>
        </Modal>
    )
}

export default BidModal
