import axios from "axios";
import { BASE_URL } from "../../util/fetchfromAPI";

export const createCourse = async (courseData: any, token: string) => {
    const response = await axios.post(`${BASE_URL}/khoa-hoc/add`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateCourse = async (id: number, courseData: any, token: string) => {
    const response = await axios.put(`${BASE_URL}/khoa-hoc/put/${id}`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteCourse = async (id: number, token: string) => {
    const response = await axios.delete(`${BASE_URL}/khoa-hoc/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
