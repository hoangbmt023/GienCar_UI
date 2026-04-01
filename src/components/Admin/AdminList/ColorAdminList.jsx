import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import ColorForm from "@/components/Admin/AdminForms/ColorForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function ColorAdminList() {
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
            { key: "name", label: "Tên màu" },
            {
                key: "description",
                label: "Mô tả",
                render: (row) =>
                    row.description
                        ? row.description.length > 30
                            ? row.description.slice(0, 30) + "..."
                            : row.description
                        : "-"
            }
        ],
        []
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.colors.getAll({
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
            console.error("fetch colors error:", err);
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

            await adminService.colors.delete(deleteTarget.id);

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
                await adminService.colors.create(formData);
            } else {
                await adminService.colors.update(editing.id, formData);
            }

            closeModal();
            await fetchData(paging.page);
        } catch (err) {
            console.error("save color error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="BotConfigTitle">
                <span>Color Management</span>
            </div>
            <hr />

            {/* ACTION */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Màu hiện tại"
                onAdd={openCreate}
                showDelete={false}
                addLabel="THÊM MÀU"
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
                        ? "Chi tiết màu"
                        : editing
                            ? "Sửa màu"
                            : "Thêm màu"
                }
                onClose={closeModal}
                size="md"
            >
                <ColorForm
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
                title="Xoá màu"
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