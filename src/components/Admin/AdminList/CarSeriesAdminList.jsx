import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import CarSeriesForm from "@/components/Admin/AdminForms/CarSeriesForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function CarSeriesAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [brands, setBrands] = useState([]); // 👈 để map brand

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ================= BRAND OPTIONS =================
    const brandOptions = brands.map((b) => ({
        value: b.id,
        label: b.name
    }));

    const brandMap = useMemo(() => {
        const map = {};
        brands.forEach((b) => {
            map[b.id] = b.name;
        });
        return map;
    }, [brands]);

    // ================= TABLE =================
    const columns = useMemo(
        () => [
            {
                key: "imageUrl",
                label: "Hình",
                render: (row) =>
                    row.imageUrl ? (
                        <img
                            src={row.imageUrl}
                            alt="img"
                            style={{ width: 80, height: 50, objectFit: "cover" }}
                        />
                    ) : "-"
            },
            { key: "name", label: "Tên dòng xe" },
            {
                key: "brandId",
                label: "Brand",
                render: (row) => brandMap[row.brandId] || "-"
            },
            {
                key: "priceFrom",
                label: "Giá từ",
                render: (row) =>
                    row.priceFrom
                        ? Number(row.priceFrom).toLocaleString("vi-VN") + " đ"
                        : "-"
            },
            {
                key: "highlight",
                label: "Nổi bật",
                render: (row) => (row.highlight ? "✔️" : "❌")
            }
        ],
        [brandMap]
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.carSeries.getAll({
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
            console.error("fetch carSeries error:", err);
        }
    }, []);

    // fetch brand để select
    const fetchBrands = useCallback(async () => {
        try {
            const res = await adminService.brandes.getAll();

            if (!res?.data?.success) return;

            setBrands(res.data.data || []);
        } catch (err) {
            console.error("fetch brands error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
        fetchBrands();
    }, [fetchData, fetchBrands]);

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
        setEditing(row);
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

            await adminService.carSeries.delete(deleteTarget.id);

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
                await adminService.carSeries.create(formData);
            } else {
                await adminService.carSeries.update(editing.id, formData);
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
                <span>Car Series Management</span>
            </div>
            <hr />

            {/* ACTION */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Dòng xe hiện tại"
                onAdd={openCreate}
                showDelete={false}
                addLabel="THÊM DÒNG XE"
            />

            <hr />

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
                        ? "Chi tiết dòng xe"
                        : editing
                            ? "Sửa dòng xe"
                            : "Thêm dòng xe"
                }
                onClose={closeModal}
                size="md"
            >
                <CarSeriesForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    brandOptions={brandOptions}
                />
            </Modal>

            {/* CONFIRM DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Xoá dòng xe"
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