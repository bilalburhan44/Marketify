import { axiosInstance } from "./axiosinstance";

export const AddProduct = async (productData, imageData) => {
    try {
        const productResponse = await axiosInstance.post('/api/products/add-product', productData);
        console.log("imagedata", imageData);
        if (imageData) {
            const formData = new FormData();
            formData.append('file', imageData);
            formData.append('productId', productResponse.data.productId);

            const imageResponse = await handleFileUpload(formData);
            console.log("formData", formData);
            console.log("product id",productResponse.data.productId);
            return { productResponse: productResponse.data, imageResponse: imageResponse };
        } else {
            console.log("imageData", imageData);
            console.log("productResponse", productResponse.data);
            return { productResponse: productResponse.data, imageResponse: null };
        }
    } catch (error) {
        return error.message;
    }
}

export const GetProducts = async (filters) => {
    try {
        const response = await axiosInstance.post('/api/products/get-products', filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//getting products by id
export const GetProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
        return response.data;
    }
    catch (error) {
        return error.message;
    }
}

export const EditProduct = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`/api/products/edit-product/${id}`, payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const DeleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const handleFileUpload = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/products/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const UpdateProductStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//create new bid
export const CreateBid = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/bids/create-bid', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//get bids
export const GetBids = async (filters) => {
    try {
        const response = await axiosInstance.get("/api/bids/get-bids" , {params: filters});
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const DeleteBid = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/bids/delete-bid/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
}