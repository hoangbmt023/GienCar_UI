import { useEffect, useState, useMemo, useCallback } from "react";
import { adminService } from "@/services/Admin/adminService";
import DataTable from "@/components/Admin/DataTable/DataTable";
import ActionCard from "@/components/Admin/ActionCard/ActionCard";
import Modal from "@/components/Admin/Modal/Modal";
import ConfirmModal from "@/components/Admin/Modal/ConfirmModal";
import MenuHeaderFooterForm from "@/components/Admin/AdminForms/MenuHeaderFooterForm";

export default function MenuAdminList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [type, setType] = useState("HEADER");
    const [locale, setLocale] = useState("EN");


    const columns = useMemo(
        () => [
            { key: "name", label: "Tên menu" },
            { key: "slug", label: "Slug" },
            { key: "url", label: "URL" },
            {
                key: "target",
                label: "Target",
                render: (row) => row.target || "-"
            },
            {
                key: "children",
                label: "Menu con",
                render: (row) =>
                    row.children?.length
                        ? `${row.children.length} items`
                        : "-"
            }
        ],
        []
    );

    const parentOptions = rows.map((x) => ({
        value: x.id,
        label: x.name
    }));

    const fetchData = useCallback(async () => {
        try {
            const res = await adminService.getMenus({ type, locale });

            if (!res?.data?.success) return;

            const list = res.data.data || [];

            function normalize(menu, parentId = "") {
                return {
                    id: menu.id,
                    name: menu.name || "-",
                    slug: menu.slug || "-",
                    url: menu.url || "-",
                    target: menu.target?.[0] === "_self" ? "SELF" : "BLANK",

                    parentId: parentId,

                    children: (menu.children || []).map(child =>
                        normalize(child, menu.id)
                    ),
                };
            }

            setRows(list.map(normalize));
        } catch (err) {
            console.error("fetch error:", err);
        }
    }, [type, locale]);

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
            ...row,
            parentId: row.parentId ?? "",
            type: type,
            locale: locale,
            target: row.target,
        });

        setOpen(true);
    };

    const openView = (row) => {
        setViewMode(true);
        setEditing({
            ...row,
            parentId: row.parentId ?? "",
        });
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

            await adminService.deleteMenu({ id: deleteTarget.id });

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

            if (!editing) {
                await adminService.createMenu(payload);
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
            <div className="BotConfigTitle"><span>Menu Management</span></div>
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

                <div style={{ display: "flex", gap: 10 }}>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="HEADER">Header</option>
                        <option value="FOOTER">Footer</option>
                    </select>

                    <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                    >
                        <option value="VI">VI</option>
                        <option value="EN">EN</option>
                    </select>
                </div>
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
                        ? "Chi tiết menu"
                        : editing
                            ? "Sửa menu"
                            : "Thêm menu"
                }
                onClose={closeModal}
                size="md"
            >
                <MenuHeaderFooterForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    parentOptions={parentOptions}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá menu"
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