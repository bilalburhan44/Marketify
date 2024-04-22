import React from 'react'
import { Divider, Modal, Table, message } from 'antd';
import { useDispatch } from 'react-redux';
import { GetBids } from '../../../apicalls/products';
import { SetLoader } from '../../../redux/loadersSlice';
import moment from 'moment';

function ProductBids({ showbidsModal, setShowbidsModal, selectedProduct }) {
    const [bidsdata, setbidsdata] = React.useState([])
    const dispatch = useDispatch();

    const getdata = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetBids({ product: selectedProduct._id });
            dispatch(SetLoader(false));
            if (response.success) {
                setbidsdata(response.data);
            } else {
                console.log("Failed to fetch bids");
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }

    React.useEffect(() => {
        if (selectedProduct) {
            getdata();
        }
    }, [selectedProduct])

    const columns = [
        {
            title : 'Bid Placed on',
            dataIndex : 'createdAt',
            render : (text) => {
                return moment(text).format("DD-MM-YYYY");
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => {
                return record.buyer.name
            }

        },
        {
            title: 'Amount',
            dataIndex: 'bidAmount',
            key: 'amount',
        },
        {
            title: 'Bid Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                return new Date(text).toLocaleString();
            }
        },
        {
            title: 'Message',
            dataIndex: 'message',
        },
        {
            title: 'Contact Details',
            dataIndex: 'contactDetails',
            render: (text, record) => {
                return (
                    <div>
                        <p>{record.buyer.email}</p>
                        <p>{record.phone}</p>
                    </div>
                )
            }

        }
    ]
    return (
        <Modal
            open={showbidsModal}
            onCancel={() => setShowbidsModal(false)}
            centered
            footer={null}
            width={1000}
        >
            <div className='flex flex-col gap-3'>
                <h1 className='text-xl font-bold text-primary'>Bids</h1>
                <Divider />
                <h1 className='text-xl text-gray-500'>Product Name : {selectedProduct.name}</h1>
                <Table columns={columns} dataSource={bidsdata} />
            </div>
        </Modal>
    )
}

export default ProductBids
