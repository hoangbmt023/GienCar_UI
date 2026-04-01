import axiosClient from "@/services/axiosClient";
import publicRequest from "@/services/publicRequest";

export const adminService = {

    //     banners: {
    //     get(position) {
    //       return publicRequest.get("/banners", { params: { position } });
    //     },
    //     create(data) {
    //       return axiosClient.post("/banners", data);
    //     },
    //     move(data) {
    //       return axiosClient.patch("/banners/move", data);
    //     },
    //     delete(data) {
    //       return axiosClient.delete("/banners", { data });
    //     }
    //   },

    //   menus: {
    //     get(params) {
    //       return publicRequest.get("/menus", { params });
    //     },
    //     create(data) {
    //       return axiosClient.post("/menus", data);
    //     },
    //     move(data) {
    //       return axiosClient.patch("/menus/move", data);
    //     },
    //     delete(data) {
    //       return axiosClient.delete("/menus", { data });
    //     }
    //   },

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
    },

    getMenus(params) {
        return publicRequest.get("/menus", {
            params
        });
    },

    createMenu(data) {
        return axiosClient.post("/menus", data);
    },

    deleteMenu(data) {
        return axiosClient.delete("/menus", {
            data
        });
    },

    moveMenu(data) {
        return axiosClient.patch("/menus/move", data);
    },

    cars: {
        getAll(params) {
            return publicRequest.get("/cars", { params });
        },
        search(q, params) {
            return publicRequest.get("/cars/search", { params: { q, ...params } });
        },
        getById(id) {
            return publicRequest.get(`/cars/${id}`);
        },
        getBySlug(slug) {
            return publicRequest.get(`/cars/slug/${slug}`);
        },
        create(data) {
            return axiosClient.post("/cars", data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        update(id, data) {
            return axiosClient.put(`/cars/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        delete(id) {
            return axiosClient.delete(`/cars/${id}`);
        },
        colors: {
            add(carId, data) {
                return axiosClient.post(`/cars/${carId}/colors`, data, { headers: { "Content-Type": "multipart/form-data" } });
            },
            remove(carId, colorId) {
                return axiosClient.delete(`/cars/${carId}/colors/${colorId}`);
            }
        },
        moveImage(carId, oldIndex, newIndex) {
            return axiosClient.patch(`/cars/${carId}/images/move`, null, { params: { oldIndex, newIndex } });
        },

        specifications: {
            get(carId) {
                return publicRequest.get(`/cars/${carId}/specifications`);
            },
            upsert(carId, data) {
                return axiosClient.put(`/cars/${carId}/specifications`, data);
            },
            delete(carId) {
                return axiosClient.delete(`/cars/${carId}/specifications`);
            }
        }
    },

    brandes: {
        getAll(params) {
            return publicRequest.get("/brandes", { params });
        },
        getById(id) {
            return publicRequest.get(`/brandes/${id}`);
        },
        create(data) {
            return axiosClient.post("/brandes", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
        update(id, data) {
            return axiosClient.put(`/brandes/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
        delete(id) {
            return axiosClient.delete(`/brandes/${id}`);
        }
    },

    carSeries: {
        getAll(params) {
            return publicRequest.get("/car-series", { params });
        },
        filter(status, highlight, params) {
            return publicRequest.get("/car-series/filter", { params: { status, highlight, ...params } });
        },
        getById(id) {
            return publicRequest.get(`/car-series/${id}`);
        },
        create(data) {
            return axiosClient.post("/car-series", data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        update(id, data) {
            return axiosClient.put(`/car-series/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        move(data) {
            return axiosClient.patch("/car-series/move", data);
        },
        delete(id) {
            return axiosClient.delete(`/car-series/${id}`);
        }
    },

    categories: {
        getAll(params) {
            return publicRequest.get("/categories", { params });
        },
        getById(id) {
            return publicRequest.get(`/categories/${id}`);
        },
        create(data) {
            return axiosClient.post("/categories", data);
        },
        update(id, data) {
            return axiosClient.put(`/categories/${id}`, data);
        },
        delete(id) {
            return axiosClient.delete(`/categories/${id}`);
        }
    },

    colors: {
        getAll(params) {
            return publicRequest.get("/colors", { params });
        },
        getById(id) {
            return publicRequest.get(`/colors/${id}`);
        },
        getBySlug(slug) {
            return publicRequest.get(`/colors/slug/${slug}`);
        },
        create(data) {
            return axiosClient.post("/colors", data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        update(id, data) {
            return axiosClient.put(`/colors/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        },
        delete(id) {
            return axiosClient.delete(`/colors/${id}`);
        }
    }
};