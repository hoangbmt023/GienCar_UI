import publicRequest from "./publicRequest";

export const carSeriesService = {
    getSeries(params = {}) {
        return publicRequest.get("/car-series", {
            params
        });
    }
};