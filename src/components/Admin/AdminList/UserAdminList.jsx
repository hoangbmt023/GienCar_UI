import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import UserForm from "@/components/Admin/AdminForms/UserForm";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";

export default function UserAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, last: 1 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [banLoading, setBanLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ================= TABLE =================
    const columns = useMemo(
        () => [
            { key: "email", label: "Email" },
            {
                key: "roles",
                label: "Quyền",
                render: (row) =>
                    row.roles?.map(r => r.toUpperCase()).join(", ") || "-"
            },
            {
                key: "status",
                label: "Trạng thái",
                render: (row) => (
                    <span style={{ color: row.status === "banned" ? "red" : "green" }}>
                        {row.status === "banned" ? "Bị khóa" : "Hoạt động"}
                    </span>
                )
            }
        ],
        []
    );

    // ================= FETCH =================
    const fetchData = useCallback(async (page = 1) => {
        try {
            const res = await adminService.users.getAll({
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
            console.error("fetch users error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    const handlePageChange = (page) => {
        fetchData(page);
    };

    // ================= MODAL =================
    const openView = (row) => {
        setViewMode(true);
        setEditing(row);
        setOpen(true);
    };

    const openEdit = (row) => {
        setViewMode(false);
        setEditing(row);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditing(null);
        setViewMode(false);
    };

    // ================= DELETE =================
    const askDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);

            await adminService.users.delete(deleteTarget.id);

            setConfirmOpen(false);
            setDeleteTarget(null);

            await fetchData(paging.page);
        } catch (err) {
            console.error("delete user error:", err);
        } finally {
            setDeleting(false);
        }
    };

    // ================= SUBMIT =================
    const handleSubmitForm = async (data) => {
        if (viewMode || !editing) return;

        try {
            setSaving(true);

            await adminService.users.updateRoles(editing.id, data.roles);

            closeModal();
            await fetchData(paging.page);
        } catch (err) {
            console.error("update role error:", err);
        } finally {
            setSaving(false);
        }
    };

    // ================= BAN / UNBAN =================
    const handleBan = async (userId) => {
        if (!confirm("Bạn có chắc muốn khóa tài khoản này?")) return;

        try {
            setBanLoading(true);
            await adminService.users.ban(userId);
            setBanLoading(false);

            closeModal();
            await fetchData(paging.page);    // reload list

        } catch (err) {
            console.error("ban error:", err);
        }
    };

    const handleUnban = async (userId) => {
        if (!confirm("Bạn có chắc muốn mở khóa tài khoản này?")) return;

        try {
            setBanLoading(true);
            await adminService.users.unban(userId);
            setBanLoading(false);

            closeModal();
            await fetchData(paging.page);

        } catch (err) {
            console.error("unban error:", err);
        }
    };

    return (
        <>
            <div className="BotConfigTitle">
                <span>User Management</span>
            </div>
            <hr />

            {/* ACTION */}
            <ActionCard
                title="Tổng:"
                value={rows.length}
                subtitle="Người dùng"
                showDelete={false}
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
                        ? "Chi tiết user"
                        : "Cập nhật quyền"
                }
                onClose={closeModal}
                size="sm"
            >
                <UserForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    onBan={handleBan}
                    onUnban={handleUnban}
                    submitText="Cập nhật"
                    loading={saving}
                    readOnly={viewMode}
                />
            </Modal>

            {/* CONFIRM DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Xoá user"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.email ?? ""}" không?`}
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