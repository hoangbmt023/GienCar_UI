import axiosClient from "./axiosClient";

export const specificationService = {
    getCarSpecs(carId) {
        return axiosClient.get(`/cars/${carId}/specifications`);
    }
};