import publicRequest from "./publicRequest";
import axiosClient from "./axiosClient";

export const menuService = {

    // 🔥 Lấy danh sách menu (HEADER / FOOTER)
    getMenus(params = {}) {
        return publicRequest.get("/menus", {
            params: params
        });
    },

    // 🔥 Tạo menu mới
    createMenu(data) {
        return axiosClient.post("/menus", data);
    },

    // 🔥 Xóa menu theo ID
    deleteMenu(data) {
        return axiosClient.delete("/menus", {
            data: data
        });
    },

    // 🔥 Di chuyển menu
    moveMenu(data) {
        return axiosClient.patch("/menus/move", data);
    }

};