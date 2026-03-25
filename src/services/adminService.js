import axiosClient from "./axiosClient";

export const bannerAdminService = {

    // lấy banner HERO_CAR
    getHeroBanners() {
        return publicRequest.get("/banners", {
            params: {
                position: "HERO_CAR"
            }
        });
    },

    // tạo banner (multipart/form-data)
    createBanner(data) {
        return axiosClient.post("/banners", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    // move banner
    moveBanner(data) {
        return axiosClient.put("/banners/move", data);
    },

    // delete banner
    deleteBanner(data) {
        return axiosClient.delete("/banners", {
            data: data
        });
    }

};