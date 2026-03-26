import axiosClient from "@/services/axiosClient";
import publicRequest from "@/services/publicRequest";

export const adminService = {

    // GET menus
    getBanners(position) {
        return publicRequest.get("/banners", {
            params: { position }
        });
    },

    // CREATE
    createBanners(data) {
        return axiosClient.post("/banners", data);
    },

    // MOVE
    moveBanners(data) {
        return axiosClient.patch("/banners/move", data);
    },

    // DELETE
    deleteBanners(data) {
        return axiosClient.delete("/banners", {
            data
        });
    }
};