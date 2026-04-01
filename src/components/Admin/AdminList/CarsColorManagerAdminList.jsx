import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function CarsColorManagerAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [open, setOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    const [colors, setColors] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState("");
    const [files, setFiles] = useState([]);
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
                key: "colors",
                label: "Màu",
                render: (row) => (
                    <button
                        className={`Btn ${row.exteriorColors?.length
                            ? "Btn--primary"
                            : "Btn--danger"
                            }`}
                        onClick={() => openColors(row)}
                    >
                        {row.exteriorColors?.length
                            ? `Sửa (${row.exteriorColors.length})`
                            : "Thêm màu"}
                    </button>
                )
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

            setRows(res.data.data || []);

            setPaging({
                page: res.data.pagination?.page || 1,
                last: res.data.pagination?.last || 1
            });
        } catch (err) {
            console.error("fetch cars error:", err);
        }
    }, []);

    // ================= FETCH COLORS =================
    const fetchColors = useCallback(async () => {
        try {
            const res = await adminService.colors.getAll({
                page: 1,
                size: 100
            });

            if (!res?.data?.success) return;

            setColors(res.data.data || []);
        } catch (err) {
            console.error("fetch colors error:", err);
        }
    }, []);

    useEffect(() => {
        fetchCars(1);
        fetchColors();
    }, [fetchCars, fetchColors]);

    // ================= OPEN MODAL =================
    const openColors = (car) => {
        setSelectedCar(car);
        setSelectedColorId("");
        setFiles([]);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedCar(null);
        setSelectedColorId("");
        setFiles([]);
    };

    // ================= ADD COLOR =================
    const handleAddColor = async () => {
        if (!selectedColorId) {
            alert("Vui lòng chọn màu");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("colorId", selectedColorId);

            files.forEach((file) => {
                formData.append("imageFiles", file);
            });

            await adminService.cars.colors.add(
                selectedCar.id,
                formData
            );

            alert("Thêm màu thành công!");

            await fetchCars(paging.page);

            // refresh lại selectedCar
            const updated = await adminService.cars.getById(selectedCar.id);
            setSelectedCar(updated.data.data);
            setFiles([]);
            setSelectedColorId("");
        } catch (err) {
            console.error("add color error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ================= REMOVE COLOR =================
    const handleRemoveColor = async (colorId) => {
        if (!window.confirm("Xoá màu này khỏi xe?")) return;

        try {
            await adminService.cars.colors.remove(
                selectedCar.id,
                colorId
            );

            await fetchCars(paging.page);

            const updated = await adminService.cars.getById(selectedCar.id);
            setSelectedCar(updated.data.data);
        } catch (err) {
            console.error("remove color error:", err);
        }
    };

    // ================= PAGINATION =================
    const handlePageChange = (page) => {
        fetchCars(page);
    };

    const colorMap = useMemo(() => {
        const map = {};
        colors.forEach(c => {
            map[c.id] = c.name;
        });
        return map;
    }, [colors]);

    return (
        <>
            <div className="BotConfigTitle">
                <span>Car Colors Management</span>
            </div>
            <hr />

            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Xe có thể gắn màu"
                showDelete={false}
                showAdd={false}
            />

            <hr />

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
                title={`Quản lý màu - ${selectedCar?.name || ""}`}
                onClose={closeModal}
                size="lg"
            >
                {!selectedCar ? (
                    <div>Đang tải...</div>
                ) : (
                    <>
                        {/* ===== MÀU HIỆN CÓ ===== */}
                        <h4>Màu hiện có</h4>

                        {selectedCar.exteriorColors?.length ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 12
                                }}
                            >
                                {selectedCar.exteriorColors.map((c) => (
                                    <div
                                        key={c.colorId}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: 8,
                                            padding: 10,
                                            width: 140
                                        }}
                                    >
                                        <img
                                            src={c.imageUrls?.[0]}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: 80,
                                                objectFit: "cover",
                                                borderRadius: 6
                                            }}
                                        />

                                        <div
                                            style={{
                                                marginTop: 6,
                                                fontWeight: 500
                                            }}
                                        >
                                            {colorMap[c.colorId] || "Không rõ"}
                                        </div>

                                        <button
                                            className="Btn Btn--danger"
                                            style={{
                                                marginTop: 6,
                                                width: "100%"
                                            }}
                                            onClick={() =>
                                                handleRemoveColor(c.colorId)
                                            }
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>Chưa có màu</div>
                        )}

                        <hr style={{ margin: "20px 0" }} />

                        {/* ===== THÊM MÀU ===== */}
                        <div
                            style={{
                                border: "1px dashed #ccc",
                                padding: 16,
                                borderRadius: 8
                            }}
                        >
                            <h4>Thêm màu mới</h4>

                            {/* SELECT COLOR */}
                            <select
                                value={selectedColorId}
                                onChange={(e) =>
                                    setSelectedColorId(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    padding: 8
                                }}
                            >
                                <option value="">-- chọn màu --</option>
                                {colors.map((c) => {
                                    const isUsed =
                                        selectedCar.exteriorColors?.some(
                                            (ec) => ec.colorId === c.id
                                        );

                                    return (
                                        <option
                                            key={c.id}
                                            value={c.id}
                                            disabled={isUsed}
                                        >
                                            {c.name} {isUsed ? "(đã có)" : ""}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* UPLOAD */}
                            <input
                                type="file"
                                multiple
                                style={{ marginTop: 10 }}
                                onChange={(e) =>
                                    setFiles([...e.target.files])
                                }
                            />

                            {/* PREVIEW */}
                            {files.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        marginTop: 10,
                                        flexWrap: "wrap"
                                    }}
                                >
                                    {files.map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                            style={{
                                                width: 60,
                                                height: 40,
                                                objectFit: "cover",
                                                borderRadius: 4
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* BUTTON */}
                            <button
                                className="Btn Btn--primary"
                                style={{
                                    marginTop: 12,
                                    width: "100%"
                                }}
                                onClick={handleAddColor}
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Thêm màu"}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}