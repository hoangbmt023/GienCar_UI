import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import SpecificationsForm from "@/components/Admin/AdminForms/SpecificationsForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function CarsSpecificationsAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [open, setOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [specData, setSpecData] = useState(null);
    const [loading, setLoading] = useState(false);

    // ================= TABLE =================
    const columns = useMemo(
        () => [
            { key: "name", label: "Tên xe" },

            {
                key: "price",
                label: "Giá",
                render: (row) =>
                    row.price
                        ? Number(row.price).toLocaleString("vi-VN") + " đ"
                        : "-"
            },

            { key: "yearProduce", label: "Năm" },
            { key: "quantity", label: "Số lượng" },

            {
                key: "spec",
                label: "Specifications",
                render: (row) => {
                    const hasSpecs = row.hasSpecs;

                    return (
                        <button
                            className={`Btn ${hasSpecs ? "Btn--primary" : "Btn--danger"
                                }`}
                            onClick={() => openSpecs(row)}
                        >
                            {hasSpecs ? "Sửa specs" : "Thêm specs"}
                        </button>
                    );
                }
            }
        ],
        []
    );

    // ================= FETCH CARS =================
    const fetchCars = useCallback(async (page = 1) => {
        try {
            const res = await adminService.cars.getAll({
                page,
                size: 5
            });

            if (!res?.data?.success) return;

            const list = res.data.data || [];

            // 🔥 CHECK SPECS CHO TỪNG XE
            const newList = await Promise.all(
                list.map(async (car) => {
                    try {
                        await adminService.cars.specifications.get(car.id);
                        return { ...car, hasSpecs: true };
                    } catch {
                        return { ...car, hasSpecs: false };
                    }
                })
            );

            setRows(newList);

            setPaging({
                page: res.data.pagination?.page || 1,
                last: res.data.pagination?.last || 1
            });
        } catch (err) {
            console.error("fetch cars error:", err);
        }
    }, []);

    useEffect(() => {
        fetchCars(1);
    }, [fetchCars]);

    // ================= OPEN MODAL =================
    const openSpecs = async (car) => {
        setSelectedCar(car);
        setOpen(true);
        setLoading(true);

        try {
            const res = await adminService.cars.specifications.get(car.id);
            setSpecData(res.data.data || {});
        } catch (err) {
            console.warn("no specs yet → create new");
            setSpecData({});
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedCar(null);
        setSpecData(null);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (payload) => {
        try {
            setLoading(true);

            await adminService.cars.specifications.upsert(
                selectedCar.id,
                payload
            );

            alert("Lưu specifications thành công!");

            closeModal();

            // 🔥 REFRESH LẠI LIST
            await fetchCars(paging.page);
        } catch (err) {
            console.error("save specs error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ================= PAGINATION =================
    const handlePageChange = (page) => {
        fetchCars(page);
    };

    return (
        <>
            <div className="BotConfigTitle">
                <span>Car Specifications Management</span>
            </div>
            <hr />

            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Xe có thể chỉnh specs"
                showDelete={false}
                showAdd={false}
            />

            <hr />
            <div className="BotConfigTitle" style={{ marginTop: "20px" }}>
                <span>Bảng dữ liệu</span>
            </div>

            {/* TABLE */}
            <DataTable
                columns={columns}
                rows={rows}
                showActions={false}
            />

            {/* PAGINATION */}
            <div
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <RenderPagination
                    data={paging}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* MODAL */}
            <Modal
                open={open}
                title={`Specifications - ${selectedCar?.name || ""}`}
                onClose={closeModal}
                size="lg"
            >
                {loading ? (
                    <div>Đang tải...</div>
                ) : (
                    <SpecificationsForm
                        initialValues={specData}
                        onSubmit={handleSubmit}
                        onCancel={closeModal}
                        loading={loading}
                    />
                )}
            </Modal>
        </>
    );
}