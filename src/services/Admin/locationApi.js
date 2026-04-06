import axiosClient from "@/services/axiosClient";

export const locationApi = {
    getProvinces() {
        return axiosClient.get("/locations/provinces");
    },

    getDistricts(code) {
        return axiosClient.get(`/locations/districts/${code}`);
    },

    getWards(code) {
        return axiosClient.get(`/locations/wards/${code}`);
    }
};