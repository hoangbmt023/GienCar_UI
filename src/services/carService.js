import publicRequest from "./publicRequest";
import axiosClient from "./axiosClient";

export const carService = {

    // Lấy danh sách xe (filter + pagination)
    getCars(params = {}) {
        return publicRequest.get("/cars", {
            params: params
        });
    },

    // Lấy xe theo ID
    getCarById(id) {
        return publicRequest.get(`/cars/${id}`);
    },

    // Lấy xe theo slug
    getCarBySlug(slug) {
        return publicRequest.get(`/cars/slug/${slug}`);
    },

    // Tạo xe mới (form-data)
    createCar(data) {
        return axiosClient.post("/cars", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    // Cập nhật xe (form-data)
    updateCar(id, data) {
        return axiosClient.put(`/cars/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    // Xóa xe
    deleteCar(id) {
        return axiosClient.delete(`/cars/${id}`);
    },

    // Thêm màu ngoại thất
    addExteriorColor(id, data) {
        return axiosClient.post(`/cars/${id}/colors`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    // Xóa màu ngoại thất
    removeExteriorColor(id, colorId) {
        return axiosClient.delete(`/cars/${id}/colors/${colorId}`);
    },

    // Di chuyển ảnh xe (đổi orderIndex)
    moveCarImage(id, oldIndex, newIndex) {
        return axiosClient.patch(`/cars/${id}/images/move`, null, {
            params: {
                oldIndex,
                newIndex
            }
        });
    },

    // Tìm kiếm xe
    searchCars(keyword, params = {}) {
        return publicRequest.get("/cars/search", {
            params: {
                q: keyword,
                ...params
            }
        });
    }

};