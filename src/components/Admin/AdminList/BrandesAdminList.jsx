import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import BrandesForm from "@/components/Admin/AdminForms/BrandesForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function BrandesAdminList() {
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
            {
                key: "logo",
                label: "Logo",
                render: (row, helpers) =>
                    row.logo ? (
                        <img
                            src={row.logo}
                            alt="logo"
                            style={{
                                width: 50,
                                height: 50,
                                objectFit: "contain",
                                cursor: "pointer"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                helpers.previewImage(row.logo);
                            }}
                        />
                    ) : "-"
            },
            { key: "name", label: "Tên brand" },
            { key: "country", label: "Quốc gia" }
        ],
        []
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.brandes.getAll({
                page,
                size: 10
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
            console.error("fetch brandes error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    const handlePageChange = (page) => {
        fetchData(page);
    };

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

            await adminService.brandes.delete(deleteTarget.id);

            setConfirmOpen(false);
            setDeleteTarget(null);

            await fetchData(paging.page);
        } catch (err) {
            console.error("delete error:", err);
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmitForm = async (formData) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing) {
                await adminService.brandes.create(formData);
            } else {
                await adminService.brandes.update(editing.id, formData);
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
                <span>Brand Management</span>
            </div>
            <hr />

            {/* ACTION */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Brand hiện tại"
                onAdd={openCreate}
                showDelete={false}
                addLabel="THÊM BRAND"
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
                        ? "Chi tiết brand"
                        : editing
                            ? "Sửa brand"
                            : "Thêm brand"
                }
                onClose={closeModal}
                size="sm"
            >
                <BrandesForm
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
                title="Xoá brand"
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