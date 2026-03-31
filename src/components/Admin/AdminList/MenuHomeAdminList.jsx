import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import MenuHomeForm from "@/components/Admin/AdminForms/MenuHomeForm";

export default function MenuHomeAdminList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [position, setPosition] = useState("HERO_CAR");

    const columns = useMemo(
        () => [
            { key: "title", label: "Tiêu đề" },
            { key: "description", label: "Mô tả" },
            { key: "ctaText", label: "CTA Text" },
            { key: "ctaLink", label: "CTA Link" },
            {
                key: "mediaType",
                label: "Loại media",
                render: (row) => {
                    const mediaUrl = row.raw.videoUrl || row.raw.imageUrl;
                    if (!mediaUrl) return "None";

                    return (
                        <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'underline' }}
                        >
                            {row.mediaType === "Video" ? "Video" : "Ảnh"}
                        </a>
                    );
                }
            },
            { key: "dateRange", label: "Thời gian" },
        ],
        []
    );

    // ================= FETCH =================
    const fetchData = useCallback(async () => {
        try {
            const res = await adminService.getBanners(position);

            if (!res?.data?.success) return;

            const list = res.data.data || [];

            setRows(
                list.map((x) => ({
                    id: x.id,
                    title: x.title || "-",
                    description: x.description || "-",
                    ctaText: x.ctaText || "-",
                    ctaLink: x.ctaLink || "-",
                    mediaType: x.videoUrl ? "Video" : (x.imageUrl ? "Image" : "None"),
                    dateRange: x.startDate && x.endDate
                        ? `${new Date(x.startDate).toLocaleDateString('vi-VN')} - ${new Date(x.endDate).toLocaleDateString('vi-VN')}`
                        : "-",
                    raw: x,
                }))
            );
        } catch (err) {
            console.error("fetch error:", err);
        }
    }, [position]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            ...row.raw,
            position: position
        });

        setOpen(true);
    };

    const openView = (row) => {
        setViewMode(true);
        setEditing(row.raw);
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

            await adminService.deleteBanners({ id: deleteTarget.id });

            setConfirmOpen(false);
            setDeleteTarget(null);

            await fetchData();
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

            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                }
                else if (value !== null && value !== undefined && value !== "") {

                    if (key === "startDate" || key === "endDate") {
                        if (value instanceof Date) {
                            formData.append(key, value.toISOString());
                        }
                    }
                    else if (typeof value === "boolean") {
                        formData.append(key, value.toString());
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            });

            console.log("=== FORM DATA ===");
            for (let [k, v] of formData.entries()) {
                console.log(k, v);
            }

            if (!editing) {
                await adminService.createBanners(formData);
            } else {
                console.warn("Update chưa implement");
            }

            closeModal();
            await fetchData();
        } catch (err) {
            console.error("save error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="BotConfigTitle"><span>Menu Home</span></div>
            <hr />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <ActionCard
                    title="Tổng:"
                    value={rows.length}
                    subtitle="Menu hiện tại"
                    onAdd={openCreate}
                    showDelete={false}
                    addLabel="THÊM MENU"
                />

                <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    style={{
                        height: 36,
                        borderRadius: 8,
                        padding: "0 10px",
                        border: "1px solid #ddd",
                        fontWeight: 600
                    }}
                >
                    <option value="HERO_CAR">Hero Banner</option>
                    <option value="HOME_GRID">Home Grid</option>
                    <option value="CONTENT_CAR">Content</option>
                    <option value="FEATURED_CAR">Featured</option>
                </select>
            </div>

            <hr />

            <DataTable
                columns={columns}
                rows={rows}
                onView={openView}
                onEdit={openEdit}
                onDelete={askDelete}
            />

            <Modal
                open={open}
                title={
                    viewMode
                        ? "Chi tiết banner"
                        : editing
                            ? "Sửa banner"
                            : "Thêm banner"
                }
                onClose={closeModal}
                size="md"
            >
                <MenuHomeForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    hideSubmit={viewMode}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá menu"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.title ?? ""}" không?`}
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