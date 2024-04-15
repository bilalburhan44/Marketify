import { Upload, Button, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../../redux/loadersSlice";
import { EditProduct, handleFileUpload } from '../../../apicalls/products';
import { InboxOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const { Dragger } = Upload;

function Images({ selectedProduct, getData , setFile }) {
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [images=[], setImages] = useState(selectedProduct ? selectedProduct.images : []);

  const props = {
    name: 'file',
    multiple: false,
    beforeUpload: file => {
      setFile(file)
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFile(null); // Reset the file when removed
      setFileList([]);
    },
    fileList,
  };
  const uploadImage = async () => {
    try {
     
      dispatch(SetLoader(true));
      const formData = new FormData();
      formData.append('file', fileList[0]);
      formData.append('productId', selectedProduct ? selectedProduct._id : null); // Handle null productId for new products
       // Log the form data before sending

      const response = await handleFileUpload(formData);
      dispatch(SetLoader(false));
      console.log("Upload Response:", response); // Log the response from the backend

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error("Upload failed. Please try again.");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error("An unexpected error occurred. Please try again later.");
    }
  };
  const deleteImage = async (image) => {
    try {
    
      const UpdateuploadedImage = images.filter((img) => img !== image)
      const UpadateProduct = {...selectedProduct, images: UpdateuploadedImage}
      const response = await EditProduct(selectedProduct._id, UpadateProduct);
      if (response.success) {
        message.success("Image deleted successfully");
        setImages(UpdateuploadedImage)
        getData();
      }else{
        message.error("Delete failed. Please try again.");
      }
      dispatch(SetLoader(false));
    }catch(error){
      dispatch(SetLoader(false));
      message.error(error.message);
    }
    }

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Dragger>
      {selectedProduct && <Button type='default' className="m-2" onClick={uploadImage}>Upload</Button>}
      <div className='flex gap-4'>
      {images.map((image)=>{
        return (
          <div className='flex gap-2 border border-gray-200 p-2 rounded'>
          <img className='h-20 w-20 object-cover' src={image} alt="image" key={image}/>
          <FontAwesomeIcon icon={faTrash}
            onClick={() =>deleteImage(image)}
            style={{cursor:"pointer"}}

            />
          </div>
          )
      })}
      </div>
    </div>
  );
}

export default Images;