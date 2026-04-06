import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import CategoryForm from "@/components/Admin/AdminForms/CategoryForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function CategoryAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ================= TABLE =================
    const columns = useMemo(
        () => [
            { key: "name", label: "Tên category" },
            {
                key: "description",
                label: "Mô tả",
                render: (row) => row.description || "-"
            }
        ],
        []
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.categories.getAll({
                page,
                size: 10
            });

            if (!res?.data?.success) return;

            // đúng structure API của bạn
            const list = res.data.data;
            const pagination = res.data.pagination;

            setRows(list || []);

            setPaging({
                page: pagination.page,
                last: pagination.last
            });

        } catch (err) {
            console.error("fetch categories error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

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

            await adminService.categories.delete(deleteTarget.id);

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
    const handleSubmitForm = async (payload) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing) {
                await adminService.categories.create(payload);
            } else {
                await adminService.categories.update(editing.id, payload);
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
                <span>Category Management</span>
            </div>
            <hr />

            {/* ACTION CARD */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Category hiện tại"
                onAdd={openCreate}
                showDelete={false}
                addLabel="THÊM CATEGORY"
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

            {/* MODAL FORM */}
            <Modal
                open={open}
                title={
                    viewMode
                        ? "Chi tiết category"
                        : editing
                            ? "Sửa category"
                            : "Thêm category"
                }
                onClose={closeModal}
                size="sm"
            >
                <CategoryForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                />
            </Modal>

            {/* CONFIRM DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Xoá category"
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