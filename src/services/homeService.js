import publicRequest from "./publicRequest";

export const homeService = {

    // lấy banner HERO_CAR
    getBanners(position) {
        return publicRequest.get("/banners", {
            params: { position }
        });
    }

};