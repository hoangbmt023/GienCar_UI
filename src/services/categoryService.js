import publicRequest from "./publicRequest";

export const categoryService = {
    getCategories(params = {}) {
        return publicRequest.get("/categories", {
            params
        });
    }
};