import { axiosInstance } from "./axiosinstance";

export const AddNotification = async (data) => {
    try {
        const response = await axiosInstance.post('/api/notifications/add-notification', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const GetAllNotification = async ()=> {
    try {
        const response = await axiosInstance.get('/api/notifications/get-notifications');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const DeleteNotification = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/notifications/delete-notification/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

//read notification
export const ReadNotifications = async () => {
    try {
        const response = await axiosInstance.put(`/api/notifications/read-all-notifications`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}