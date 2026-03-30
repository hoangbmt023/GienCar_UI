import axiosClient from "./axiosClient";

export const userService = {

    getAdmin() {
        return axiosClient.get("/users/admin");
    }

};