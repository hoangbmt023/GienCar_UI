// import * as request from "@/utils/tokenService";
// import * as authHook from '@/hooks/auth.jsx';
// import apiPublic from "@/utils/PublicRequest";
// import apiHelper from "@/utils/ApiHelper.jsx";
// import * as requests from "@/utils/Requests.jsx";

// // Đảm bảo handle lỗi đúng cách
// const handleError = (error) => {
//     console.error('API Error:', error);
//     throw error; // Hoặc trả về thông báo lỗi thân thiện
// };

// // API Đăng ký
// export const register = async (userData) => {
//     try {
//         const response = await request.post("/User/RegisterUser", userData);
//         return response;  // Trả về kết quả đăng ký (thường có token nếu thành công)
//     } catch (error) {
//         throw error.response ? error.response.data : error.message;
//     }
// }

// // API Đăng nhập
// export const login = async (account, password) => {
//     try {
//         const response = await request.post('/Auth/LoginUserToken', {
//             account,
//             password
//         });
//         return response;  // Trả về thông tin đăng nhập (thường có token nếu thành công)
//     } catch (error) {
//         throw error.response ? error.response.data : error.message;
//     }
// }

// // API Đăng xuất
// export const logout = async () => {
//     try {
//         localStorage.removeItem('token');
//     } catch (error) {
//         throw error.response ? error.response.data : error.message;
//     }
// }

// // API Forgot Password
// export const forgotPassword = async (email, type) => {
//     const res = await apiPublic.post("/Auth/ForgotPassword", { email, type });
//     return res.data; // {status, msg, data}
// };

// // API Reset Password
// export const resetPassword = async (payload) => {
//     const res = await request.post("/Auth/ResetPassword", payload);
//     return res.data;
// };

// // API Change Password
// export const changePassword = async (userId, currentPassword, newPassword) => {
//     try {
//         const response = await request.post('/User/change-password', { userId, currentPassword, newPassword });
//         return response;  // Trả về kết quả đổi mật khẩu thành công
//     } catch (error) {
//         handleError(error);
//     }
// }

// //API Vai trò
// export const fetchRoles = async (page, limit) => {
//     try {
//         const response = await request.get(`/Admin/Role`, {
//             params: { page, limit }
//         });

//         return response;

//     } catch (error) {
//         console.error("Lỗi tải vai trò:", error);
//         return {
//             status: false,
//             data: [],
//             pagination: null,
//             msg: error.response?.data?.msg || error.message || 'Lỗi khi tải danh sách vai trò'
//         };
//     }
// };

// // Tìm kiếm vai trò
// export const searchRoles = async (tenvt, page = 1, limit = 10) => {
//     try {
//         const res = await request.get('Admin/Role/search', {
//             params: { tenvt, page, limit }
//         });
//         return res;

//     } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//     }
// }

// // Lấy thông tin vai trò theo ID
// export const getRoleById = async (id) => {
//     try {
//         const response = await request.get(`Role/${id}`);
//         return response;
//     } catch (error) {
//         console.error("Lỗi lấy thông tin vai trò:", error);
//         return {
//             status: false,
//             data: null,
//             msg: error.response?.data?.msg || error.message || 'Lỗi khi lấy thông tin vai trò'
//         };
//     }
// };

// // Tạo vai trò mới
// export const createRole = (roleData) => {
//     const isFormData = roleData instanceof FormData;

//     return request.post('/Admin/Role/Them', roleData, {
//         headers: isFormData ? {} : { 'Content-Type': 'application/json' }
//     }).catch(handleError);
// };

// // Cập nhật vai trò
// export const updateRole = (id, roleData) => {
//     const isFormData = roleData instanceof FormData;

//     return request.put(`/Admin/Role/CapNhat/${id}`, roleData, {
//         headers: isFormData ? {} : { 'Content-Type': 'application/json' }
//     }).catch(handleError);
// };

// // Xóa vai trò
// export const deleteRole = (id) => {
//     return request.deleteRequest(`/Admin/Role/Xoa/${id}`).catch(handleError);
// };

// // Lấy metadata để biết các trường cần nhập cho vai trò
// export async function getRoleFormFields() {
//     const response = await request.get('/Admin/Role/metadata');
//     return response.fields;
// }

// //Api người dùng
// export const fetchUsers = async (page, limit) => {
//     try {
//         const res = await request.get("/User/GetListUser", {
//             params: { page, limit },
//         });
//         return res;
//     } catch (error) {
//         console.error("Lỗi lấy danh sách user:", error);
//     }
// };

// //Tìm kiếm người dùng
// export const searchUsers = async (tennd, page, limit) => {
//     try {
//         const response = await request.get(`/User/search`, {
//             params: { tennd, page, limit }
//         });

//         return response;

//     } catch (error) {
//         console.error("Lỗi tìm kiếm người dùng:", error);
//         return {
//             status: false,
//             data: [],
//             pagination: null,
//             msg: error.response?.data?.msg || error.message || 'Lỗi khi tìm kiếm người dùng'
//         };
//     }
// };

// export const createUser = (id, userData) => {
//     // Kiểm tra xem userData có phải là FormData không
//     const isFormData = userData instanceof FormData;

//     let payload;

//     if (isFormData) {
//         // Nếu là FormData, thêm ID vào FormData
//         if (!userData.has('id')) {
//             userData.append('id', id);
//         }
//         payload = userData;
//     } else {
//         // Nếu là đối tượng JSON, đảm bảo rằng ID được gắn vào body
//         payload = {
//             ...userData,
//             id: id  // Đảm bảo ID lowercase để match với DTO
//         };
//     }

//     // Gửi yêu cầu PUT với URL và body chứa userData
//     return request.put(`/Admin/QuanTriVienNguoiDung/CapNhat/${id}`, payload, {
//         headers: isFormData ? {} : { 'Content-Type': 'application/json' }
//     }).catch(handleError);
// };


// // Cập nhật người dùng
// export const updateInfoUser = async (formData) => {
//     // formData: FormData (đã append trong NguoiDungForm)
//     return await request.put("/User/UpdateInfoUser", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// };

// // Xóa người dùng
// export const deleteUser = async (userId) => {
//     return await request.deleteRequest("/User/DeleteUser", {
//         params: { userId }, // backend nhận [FromQuery] DeleteUserRequestDTO { UserId }
//     });
// };

// //Khoá người dùng
// export const lockUser = async (userLockDto) => {
//     try {
//         const response = await request.post('/Admin/QuanTriVienNguoiDung/lock', userLockDto);
//         return response;
//     } catch (error) {
//         console.error("Lỗi khi khóa người dùng:", error);
//         return {
//             status: false,
//             msg: error.response?.data?.message || error.message || 'Lỗi khi khóa người dùng'
//         };
//     }
// };

// //Mở khoá người dùng
// export const unlockUser = async (userId) => {
//     try {
//         const response = await request.post(`/Admin/QuanTriVienNguoiDung/${userId}`);
//         return response;
//     } catch (error) {
//         console.error("Lỗi khi mở khóa người dùng:", error);
//         return {
//             status: false,
//             msg: error.response?.data?.message || error.message || 'Lỗi khi mở khóa người dùng'
//         };
//     }
// };

// //update user info
// export const UpdateUserInfo = async (formData) => {
//     try {
//         const res = await requests.put(
//             "/User/UpdateInfoUser",
//             formData,
//             {},
//             true
//         );
//         return res;
//     } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//     }
// };

// //Tạo giao dịch vib
// export const taoGiaoDich = async (napTienDto) => {
//     try {
//         const token = authHook.getToken();

//         if (!token) {
//             throw new Error("Token không có, người dùng chưa đăng nhập!");
//         }

//         const response = await request.post('/Payments/TaoGiaoDich', napTienDto, {
//             headers: {
//                 Authorization: `Bearer ${token}`  // Thêm token vào header
//             }
//         });
//         return response;

//     } catch (error) {
//         console.error("Lỗi khi tạo giao dịch nạp tiền:", error);
//         throw error; // Ném lỗi lên để xử lý ở nơi gọi
//     }
// };

// // Huỷ giao dịch mới nhất của người dùng
// export const huyGiaoDich = async () => {
//     try {
//         const token = authHook.getToken(); // Lấy token từ localStorage

//         if (!token) {
//             throw new Error("Token không có, người dùng chưa đăng nhập!");
//         }

//         const response = await request.post('/Payments/HuyGiaoDich', {}, {
//             headers: {
//                 Authorization: `Bearer ${token}`  // Truyền token vào header
//             }
//         });

//         return response;
//     } catch (error) {
//         console.error("Lỗi khi huỷ giao dịch:", error);
//         throw error;
//     }
// };


// // Lấy lịch sử giao dịch của người dùng hiện tại
// export const layLichSuGiaoDich = async () => {
//     try {
//         const response = await request.get('/api/Payments/LichSu');
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi lấy lịch sử giao dịch:", error);
//         throw error;
//     }
// };

// // Huỷ giao dịch mới nhất của người dùng
// export const xacNhanChuyenTien = async () => {
//     try {
//         const response = await request.post('/api/Payments/HuyGiaoDich');
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi huỷ giao dịch:", error);
//         throw error;
//     }
// };


// // api nap tien qua VnPay
// export const CreatePaymentVnPay = async (userId, soTien, motaDH) => {
//     try {
//         const res = await apiHelper.post('/Wallet/CreateVnPay', {
//             userId,
//             soTien,
//             motaDH,
//             kieuDH: "order"
//         }, {}, true);

//         return res.data;
//     } catch (error) {
//         console.error("Lỗi khi huỷ giao dịch:", error);
//     }
// }

// // Tạo giao dịch MoMo
// export const taoGiaoDichMomo = async (napTienDto, userId) => {
//     try {
//         const token = authHook.getToken();
//         if (!token) throw new Error("Chưa đăng nhập");

//         const response = await request.post('/Payments/CreatePaymentUrl',
//             napTienDto,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         return response;
//     } catch (error) {
//         // Bổ sung thông tin lỗi
//         error.customMessage = "Lỗi khi gọi API MoMo";
//         throw error;
//     }
// };

// export const getUserById = async (id) => {
//     try {
//         const res = await request.get(`/User/GetUserByUserId?userId=${id}`);
//         return res;
//     } catch (error) {
//         console.error("Lỗi lấy thông tin người dùng:", error);
//     }
// };

// // Lịch sử giao dịch người dùng
// export const fetchLichSuGiaoDichs = async (walletId, page, limit) => {
//     try {
//         const response = await apiHelper.get(`/Wallet/GetWalletTransactionByWalletId`, {
//             params: { walletId, page, limit },
//         }, true);

//         return response.data;  // <-- Đây là điểm quan trọng

//     } catch (error) {
//         console.error("Lỗi khi tải lịch sử giao dịch:", error);
//         return {
//             status: false,
//             data: [],
//             pagination: null,
//             msg: error.message || 'Lỗi không xác định'
//         };
//     }
// };

// // Lấy danh sách lịch sử giao dịch
// export const fetchLichSuGiaoDichNguoiDung = async (page, limit) => {
//     try {
//         const response = await request.get('/Admin/QuanTriVienLichSuGiaoDich', {
//             params: { page, limit }
//         });

//         return response;
//     } catch (error) {
//         console.error("Lỗi tải lịch sử giao dịch:", error);
//         return {
//             status: false,
//             data: [],
//             pagination: null,
//             msg: error.message || 'Lỗi khi tải danh sách lịch sử giao dịch'
//         };
//     }
// };


// export const loginGoogle = async (idToken) => {
//     return await request.post(
//         "/Auth/ExternalProviderLoginUserToken",
//         { idToken, provider: "Google" },
//         {},
//         false
//     );
// };