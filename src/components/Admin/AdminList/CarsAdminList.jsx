import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import CarsForm from "@/components/Admin/AdminForms/CarsForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function CarsAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [carSeries, setCarSeries] = useState([]);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // ================= CAR SERIES OPTIONS =================
    const carSeriesOptions = carSeries.map((cs) => ({
        value: cs.id,
        label: cs.name
    }));

    const brandOptions = brands.map((b) => ({
        value: b.id,
        label: b.name
    }));

    const categoryOptions = categories.map((c) => ({
        value: c.id,
        label: c.name
    }));

    const carSeriesMap = useMemo(() => {
        const map = {};
        carSeries.forEach((cs) => {
            map[cs.id] = cs.name;
        });
        return map;
    }, [carSeries]);

    // ================= TABLE =================
    const columns = useMemo(
        () => [
            // IMAGE
            {
                key: "image",
                label: "Hình",
                render: (row, helpers) =>
                    row.images?.[0]?.url ? (
                        <img
                            src={row.images[0].url}
                            alt="car"
                            style={{
                                width: 80,
                                height: 50,
                                objectFit: "cover",
                                cursor: "pointer"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                helpers.previewImage(row.images[0].url);
                            }}
                        />
                    ) : "-"
            },

            // NAME
            { key: "name", label: "Tên xe" },

            // SERIES
            {
                key: "seriesId",
                label: "Dòng xe",
                render: (row) => carSeriesMap[row.seriesId] || "-"
            },

            // PRICE
            {
                key: "price",
                label: "Giá",
                render: (row) =>
                    row.price
                        ? Number(row.price).toLocaleString("vi-VN") + " đ"
                        : "-"
            },

            // DEPOSIT %
            {
                key: "depositPercentage",
                label: "Cọc (%)",
                render: (row) =>
                    row.depositPercentage != null
                        ? `${row.depositPercentage * 100}%`
                        : "-"
            },

            // YEAR
            {
                key: "yearProduce",
                label: "Năm SX"
            },

            // QUANTITY
            {
                key: "quantity",
                label: "Số lượng"
            },

            // DESCRIPTION
            {
                key: "description",
                label: "Mô tả",
                render: (row) =>
                    row.description
                        ? row.description.length > 30
                            ? row.description.slice(0, 30) + "..."
                            : row.description
                        : "-"
            },

            // COLORS
            {
                key: "exteriorColors",
                label: "Màu",
                render: (row) => {
                    const colors = row.exteriorColors || [];

                    if (!colors.length) return "-";

                    return `${colors.length} màu`;
                }
            },

            // STATUS
            {
                key: "status",
                label: "Trạng thái"
            }
        ],
        [carSeriesMap]
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.cars.getAll({
                page,
                size: 5
            });

            if (!res?.data?.success) return;

            const list = res.data.data;
            const pagination = res.data.pagination;

            setRows(list || []);

            setPaging({
                page: pagination.page || 1,
                last: pagination.last || 1
            });

        } catch (err) {
            console.error("fetch cars error:", err);
        }
    }, []);

    const fetchCarSeries = useCallback(async () => {
        try {
            const res = await adminService.carSeries.getAll();

            if (!res?.data?.success) return;

            setCarSeries(res.data.data || []);
        } catch (err) {
            console.error("fetch carSeries error:", err);
        }
    }, []);

    const fetchBrands = useCallback(async () => {
        try {
            const res = await adminService.brandes.getAll();
            if (!res?.data?.success) return;

            setBrands(res.data.data || []);
        } catch (err) {
            console.error("fetch brands error:", err);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await adminService.categories.getAll();
            if (!res?.data?.success) return;

            setCategories(res.data.data || []);
        } catch (err) {
            console.error("fetch categories error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
        fetchCarSeries();
        fetchBrands();
        fetchCategories();
    }, [fetchData, fetchCarSeries, fetchBrands, fetchCategories]);

    // ================= PAGINATION =================
    const handlePageChange = (page) => {
        fetchData(page);
    };

    // ================= ACTION =================
    const openCreate = () => {
        setViewMode(false);
        setEditing(null);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditing(null);
        setViewMode(false);
    };

    const openEdit = (row) => {
        setViewMode(false);

        setEditing({
            ...row,
            brandIds: row.brandIds || []
        });

        setOpen(true);
    };

    const openView = (row) => {
        setViewMode(true);
        setEditing(row);
        setOpen(true);
    };

    const askDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);

            await adminService.cars.delete(deleteTarget.id);

            setConfirmOpen(false);
            setDeleteTarget(null);

            await fetchData(paging.page);
        } catch (err) {
            console.error("delete error:", err);
        } finally {
            setDeleting(false);
        }
    };

    // ================= SUBMIT =================
    const handleSubmitForm = async (formData) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing) {
                await adminService.cars.create(formData);
            } else {
                await adminService.cars.update(editing.id, formData);
            }

            closeModal();
            await fetchData(paging.page);
        } catch (err) {
            console.error("save error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="BotConfigTitle">
                <span>Cars Management</span>
            </div>
            <hr />

            {/* ACTION */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Xe hiện tại"
                onAdd={openCreate}
                showDelete={false}
                addLabel="THÊM XE"
            />

            <hr />
            <div className="BotConfigTitle" style={{ marginTop: "20px" }}>
                <span>Bảng dữ liệu</span>
            </div>

            {/* TABLE */}
            <DataTable
                columns={columns}
                rows={rows}
                onView={openView}
                onEdit={openEdit}
                onDelete={askDelete}
            />

            {/* PAGINATION */}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <RenderPagination
                    data={paging}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* MODAL */}
            <Modal
                open={open}
                title={
                    viewMode
                        ? "Chi tiết xe"
                        : editing
                            ? "Sửa xe"
                            : "Thêm xe"
                }
                onClose={closeModal}
                size="md"
            >
                <CarsForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    carSeriesOptions={carSeriesOptions}
                    brandOptions={brandOptions}
                    categoryOptions={categoryOptions}
                />
            </Modal>

            {/* CONFIRM DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Xoá xe"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.name ?? ""}" không?`}
                danger
                loading={deleting}
                onCancel={() => {
                    if (deleting) return;
                    setConfirmOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}